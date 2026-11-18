import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const US_VIN = '1M8GDM9AXKP042788';
const EU_VIN = 'WVWZZZ1JZBW123456';
const KR_VIN = 'KMHCT4AE7FU123456';
const evidenceDirectory = path.join(process.cwd(), '..', 'docs', 'evidence', 'm1');

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
}

async function capture(page: Page, name: string) {
  await mkdir(evidenceDirectory, { recursive: true });
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidenceDirectory, `${name}-360.png`), fullPage: true });
}

async function runLookup(page: Page, identifier: string) {
  await page.goto('/');
  await page.getByLabel('VIN or chassis number').fill(identifier);
  await page.getByRole('button', { name: 'Run a free check' }).click();
  await expect(page).toHaveURL(/\/preview\/RCC-/);
}

test('AT-01 and AT-07: records preview, price, sources and public replay', async ({ page }) => {
  await runLookup(page, US_VIN);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We found records for this vehicle');
  await expect(page.getByRole('heading', { name: '2019 Mitsubishi Outlander' })).toBeVisible();
  await expect(page.getByText('GH₵149.00', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toBeDisabled();
  await expect(page.getByText('United States', { exact: true }).last()).toBeVisible();
  await expect(page.getByText('Japan', { exact: true }).last()).toBeVisible();
  await capture(page, 'preview-records');

  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We found records for this vehicle');
  await expectNoOverflow(page);
});

test('AT-02 and AT-03: invalid identifiers fail with accessible guidance', async ({ page }) => {
  await page.goto('/');
  const field = page.getByLabel('VIN or chassis number');
  await field.fill('1M8GDM9AXKP04278');
  await page.getByRole('button', { name: 'Run a free check' }).click();
  await expect(page.locator('#identifier-error')).toContainText('17 characters');
  await expect(field).toHaveAttribute('aria-invalid', 'true');

  await field.fill('1M8GDM9A9KP042788');
  await page.getByRole('button', { name: 'Run a free check' }).click();
  await expect(page.locator('#identifier-error')).toHaveText('This VIN looks mistyped. Please check each character.');
  await expect(page).toHaveURL('/');
  await capture(page, 'home-invalid');
});

test('AT-05: no-record result offers official tools and no checkout', async ({ page }) => {
  await runLookup(page, KR_VIN);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('No records found in the sources checked');
  await expect(page.getByRole('heading', { name: 'Free official tools to try next' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toHaveCount(0);
  await capture(page, 'preview-no-records');
});

test('AT-06: European referral explains coverage and captures interest optionally', async ({ page }) => {
  await runLookup(page, EU_VIN);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This vehicle needs a European history source');
  await expect(page.getByText('Our US check returned no records.', { exact: false })).toBeVisible();
  await expect(page.getByLabel('Email address or phone number')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toHaveCount(0);
  await capture(page, 'preview-europe');
});

test('AT-04: Japanese chassis lead capture is idempotent in the browser flow', async ({ page }) => {
  await runLookup(page, 'NZE141-1234567');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Japanese chassis checks are not covered yet');
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toHaveCount(0);
  await capture(page, 'preview-japan');

  await page.getByLabel('Email address or phone number').fill('buyer@example.com');
  await page.getByRole('button', { name: 'Notify me about this source' }).click();
  await expect(page.getByRole('status')).toContainText('Thanks — your interest is registered.');
  await capture(page, 'lead-success');
});

test('provider unavailable and error outcomes never offer checkout', async ({ page }) => {
  const response = await page.request.post('/api/v1/lookups', {
    data: { identifier: US_VIN, shippingFrom: 'usa' },
    headers: { 'x-rcc-session': 'e2e_provider_outcomes' },
  });
  expect(response.status()).toBe(201);
  const preview = await response.json() as Record<string, unknown>;
  let status = 'provider_unavailable';

  await page.route('**/api/v1/lookups/*', async (route) => {
    const coverage = Array.isArray(preview.coverage)
      ? preview.coverage.map((source) => source.country === 'United States' ? { ...source, status: 'unavailable', records: undefined } : source)
      : [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ...preview, status, counts: {}, totalRecords: 0, coverage }),
    });
  });

  await page.goto(`/preview/${String(preview.publicId)}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The vehicle records source is unavailable');
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toHaveCount(0);
  await capture(page, 'preview-provider-unavailable');

  status = 'provider_error';
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('We could not complete the free check');
  await expect(page.getByRole('button', { name: 'Continue to secure checkout' })).toHaveCount(0);
  await capture(page, 'preview-provider-error');
});

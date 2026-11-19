import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const evidence = path.join(process.cwd(), '..', 'docs', 'evidence', 'm1');
const run = Date.now();

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
}

async function readMockCode(page: Page): Promise<string> {
  const box = page.getByTestId('mock-code');
  await expect(box).toBeVisible();
  const code = await box.getAttribute('data-code');
  expect(code).toMatch(/^\d{6}$/);
  return code ?? '';
}

test.beforeAll(async () => {
  await mkdir(evidence, { recursive: true });
});

test.beforeEach(async ({ page }, testInfo) => {
  const testOctet = (testInfo.line % 200) + 1;
  const runOctet = (Math.floor(run / 1000) % 200) + 1;
  await page.context().setExtraHTTPHeaders({
    'x-forwarded-for': `10.${testOctet}.${runOctet}.${(run % 200) + 1}`,
  });
});

test('register creates an account, shows it in the header and signs out everywhere', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const email = `rcc.register.${run}@example.com`;
  await page.goto('/register');

  await expect(page.getByRole('heading', { name: 'Create your account', level: 1 })).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'register-desktop.png') });

  await page.getByRole('button', { name: 'Email', exact: true }).click();
  await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: 'Send code' }).click();

  const code = await readMockCode(page);
  await expect(page.getByRole('button', { name: /Resend in/ })).toBeDisabled();
  await page.getByLabel('Six-digit code').fill(code);
  await page.getByRole('button', { name: 'Verify and continue' }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('heading', { name: 'Your account', level: 1 })).toBeVisible();
  await expect(page.getByText(email, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Your account' }).first()).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'account-desktop.png') });

  await page.getByRole('button', { name: 'Sign out of all devices' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
});

test('login rejects a wrong code then signs in with SMS', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const phone = `024${String(run % 10_000_000).padStart(7, '0')}`;
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: 'Welcome back', level: 1 })).toBeVisible();
  await page.getByLabel('Ghana mobile number').fill(phone);
  await page.getByRole('button', { name: 'Send code' }).click();

  const code = await readMockCode(page);
  const wrong = code === '000000' ? '111111' : '000000';
  await page.getByLabel('Six-digit code').fill(wrong);
  await page.getByRole('button', { name: 'Verify and continue' }).click();
  await expect(page.getByRole('alert').filter({ hasText: /not correct/ })).toBeVisible();

  await page.getByLabel('Six-digit code').fill(code);
  await page.getByRole('button', { name: 'Verify and continue' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByText(`+233${phone.slice(1)}`, { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('link', { name: 'Sign in' }).first()).toBeVisible();
});

test('mobile auth screens fit 360px and the menu reaches sign-in', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const email = `rcc.mobile.${run}@example.com`;
  await page.goto('/register');

  await expect(page.getByRole('heading', { name: 'Create your account', level: 1 })).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'register-360.png'), fullPage: true });

  await page.getByRole('button', { name: 'Check a car' }).click();
  const menu = page.getByRole('dialog', { name: 'Real Chassis Check' });
  await expect(menu.getByRole('link', { name: 'Sign in' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Create account' })).toBeVisible();
  await page.keyboard.press('Escape');

  await page.getByRole('button', { name: 'Email', exact: true }).click();
  await page.getByLabel('Email address').fill(email);
  await page.getByRole('button', { name: 'Send code' }).click();
  await readMockCode(page);
  await page.getByRole('button', { name: 'Use this code' }).click();
  await page.getByRole('button', { name: 'Verify and continue' }).click();

  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('heading', { name: 'Your account', level: 1 })).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'account-360.png'), fullPage: true });
});

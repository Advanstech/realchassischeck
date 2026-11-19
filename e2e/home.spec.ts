import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const evidence = path.join(process.cwd(), '..', 'docs', 'evidence', 'm1');

async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
}

test.beforeAll(async () => {
  await mkdir(evidence, { recursive: true });
});

test('desktop navigation, hero and scroll story', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');

  const title = page.getByRole('heading', { level: 1 });
  await expect(title).toHaveText('Check any car before you pay.');
  const lineHeights = await title.locator('span').evaluateAll((lines) =>
    lines.map((line) => line.getBoundingClientRect().height),
  );
  expect(lineHeights).toHaveLength(2);
  expect(lineHeights.every((height) => height < 75)).toBe(true);

  const navigation = await page.getByRole('navigation', { name: 'Primary' }).boundingBox();
  expect(navigation).not.toBeNull();
  expect(Math.abs((navigation?.x ?? 0) + (navigation?.width ?? 0) / 2 - 720)).toBeLessThan(2);
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'home-desktop.png') });

  const heroBox = await title.boundingBox();
  await page.evaluate(() => window.scrollTo({ top: 420, behavior: 'instant' }));
  await page.waitForTimeout(350);
  const pinnedBox = await title.boundingBox();
  expect(heroBox).not.toBeNull();
  expect(pinnedBox).not.toBeNull();
  expect(Math.abs((pinnedBox?.y ?? 0) - (heroBox?.y ?? 0))).toBeLessThan(4);
  await page.screenshot({ path: path.join(evidence, 'hero-pinned-desktop.png') });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(250);

  const trust = page.getByRole('heading', { name: 'Trust should be easy to see.' });
  await trust.scrollIntoViewIfNeeded();
  await expect(trust).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Named sources. Dated records.' })).toBeVisible();
  await page.waitForTimeout(650);
  await page.screenshot({ path: path.join(evidence, 'trust-reveal-desktop.png') });

  const track = page.getByTestId('how-track');
  const bounds = await track.evaluate((element) => ({
    top: element.getBoundingClientRect().top + window.scrollY,
    height: element.getBoundingClientRect().height,
  }));
  const scrollToStep = async (progress: number) => {
    await page.evaluate(
      ({ top, height, progress: stepProgress }) => {
        const stickyDistance = Math.max(0, height - window.innerHeight);
        window.scrollTo({ top: top + stickyDistance * stepProgress });
      },
      { ...bounds, progress },
    );
    await page.waitForTimeout(800);
  };

  await scrollToStep(0.02);
  await page.screenshot({ path: path.join(evidence, 'how-vin-desktop.png') });
  await scrollToStep(0.52);
  await expect(page.getByRole('heading', { name: 'See the free preview first', exact: true }).last()).toBeAttached();
  await page.screenshot({ path: path.join(evidence, 'how-preview-desktop.png') });
  await scrollToStep(0.88);
  await page.screenshot({ path: path.join(evidence, 'how-report-desktop.png') });

  await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('footer-watermark')).toBeVisible();
  await expect(page.getByText('Built for the moment before money moves.')).toBeVisible();
  await page.screenshot({ path: path.join(evidence, 'footer-desktop.png') });
  await expectNoOverflow(page);
});

test('mobile home, VIN help and every journey step', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const mobileTitle = page.getByRole('heading', { level: 1 });
  await expect(mobileTitle).toHaveText('Check any car before you pay.');
  const mobileLineHeights = await mobileTitle.locator('span').evaluateAll((lines) =>
    lines.map((line) => line.getBoundingClientRect().height),
  );
  expect(mobileLineHeights).toHaveLength(2);
  expect(mobileLineHeights.every((height) => height < 50)).toBe(true);
  await expect(page.getByLabel('VIN or chassis number')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check free' })).toBeVisible();
  for (const heading of ['Enter the 17-character VIN', 'See the free preview first', 'Pay once, read the whole report']) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  }
  await expect(page.getByText('Built for the moment before money moves.')).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({ path: path.join(evidence, 'home-360.png'), fullPage: true });

  const helpTrigger = page.getByRole('button', { name: 'Where is my VIN?' });
  await helpTrigger.click();
  const help = page.getByRole('dialog', { name: 'Where is my VIN?' });
  await expect(help).toBeVisible();
  for (const location of ['Base of the windscreen', 'Driver’s door post', 'Engine bay', 'Registration document']) {
    await expect(help.getByRole('heading', { name: location })).toBeVisible();
  }
  await page.screenshot({ path: path.join(evidence, 'vin-help-360.png'), fullPage: true });
  await page.keyboard.press('Escape');
  await expect(help).toHaveCount(0);
  await expect(helpTrigger).toBeFocused();
});

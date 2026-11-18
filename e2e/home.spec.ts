import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test } from '@playwright/test';

/** M1 home: renders at 360 px with no horizontal overflow and the lookup intact. */
test('M1 home at 360 px', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Vehicle history checks for Ghana',
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);

  await expect(page.getByLabel('VIN or chassis number')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Run a free check' })).toBeVisible();

  // Evidence lives in the repo's docs/evidence; this test runs from web/.
  const directory = path.join(process.cwd(), '..', 'docs', 'evidence', 'm1');
  await mkdir(directory, { recursive: true });
  await page.screenshot({ path: path.join(directory, 'home-360.png'), fullPage: true });
});

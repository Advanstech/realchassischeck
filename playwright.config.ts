import { defineConfig } from '@playwright/test';

/**
 * Browser evidence for the buyer journey. The default viewport is 360 px wide,
 * because that is the gate for every buyer screen (AGENTS.md "Prove it").
 * Start the standalone API and web production builds before running this suite.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    viewport: { width: 360, height: 800 },
    deviceScaleFactor: 2,
  },
});

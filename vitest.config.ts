import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Unit tests live in src/. The Playwright specs in e2e/ are run by `pnpm test:e2e`,
    // not by Vitest, so they must never be picked up here.
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', '.next/**'],
  },
});

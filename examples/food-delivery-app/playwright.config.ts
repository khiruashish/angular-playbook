import { defineConfig, devices } from '@playwright/test';

/**
 * E2E tests run against `ng serve` (dev config = mock API), so they need no backend.
 * In CI against QA: BASE_URL=https://qa.food.example.com npx playwright test
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env['CI'] ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env['BASE_URL'] ?? 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: process.env['CHROMIUM_PATH'] ? { executablePath: process.env['CHROMIUM_PATH'] } : {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env['BASE_URL']
    ? undefined
    : { command: 'npm start', url: 'http://localhost:4200', reuseExistingServer: !process.env['CI'], timeout: 120_000 },
});

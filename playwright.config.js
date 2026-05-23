const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');

dotenv.config();

const isCI = process.env.CI === 'true';
const baseURL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';

module.exports = defineConfig({
  testDir: './tests',

  // Execution behavior
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,

  timeout: 60_000,
  expect: {
    timeout: 10_000
  },

  // Reporting
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Shared context defaults
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    testIdAttribute: 'data-testid'
  },

  // Browser matrix
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    }
  ],

  outputDir: 'test-results'
});

const { test, expect } = require('../fixtures/base.fixture');
const LoginPage = require('../pages/LoginPage');
const { loadJson } = require('../utils/dataProvider');
const { hasCredentials, getUser } = require('../config/users');

const scenarios = loadJson('test-data/login-scenarios.json');
const standardCredentialsAvailable = hasCredentials('standard');

test.describe('Authentication - Login', () => {
  test('@smoke @e2e Valid standard user can login', async ({ page, homePage }) => {
    test.skip(!standardCredentialsAvailable, 'STANDARD_USER credentials are required for positive login scenario.');

    const loginPage = new LoginPage(page);
    const standardUser = getUser('standard');

    await test.step('Given user is on home page', async () => {
      await homePage.open();
      await expect(page).toHaveURL(/practicesoftwaretesting/);
    });

    await test.step('When user navigates to login and submits valid credentials', async () => {
      await homePage.openLogin();
      await loginPage.login(standardUser.email, standardUser.password);
    });

    await test.step('Then user should be successfully authenticated', async () => {
      await loginPage.assertLoginSucceeded();
    });
  });

  for (const scenario of scenarios.negative) {
    test(`@regression Invalid login is blocked for: ${scenario.title}`, async ({ loginPage }) => {
      await test.step('Given user is on login page', async () => {
        await loginPage.goto();
      });

      await test.step('When invalid credentials are submitted', async () => {
        await loginPage.login(scenario.email, scenario.password);
      });

      await test.step('Then login error should be displayed', async () => {
        await loginPage.assertLoginFailed();
      });
    });
  }
});

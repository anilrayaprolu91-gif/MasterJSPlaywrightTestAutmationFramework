const { test, expect } = require('../../fixtures/base.fixture');
const { loadJson } = require('../../utils/dataProvider');

const loginUsers = loadJson('test-data/login-users.json');

test.describe('Authentication - Login', () => {
  
  test('@smoke @e2e Valid user can log in successfully', async ({ homePage, loginPage }) => {
    await test.step('Given user opens the Toolshop home page', async () => {
      await homePage.open();
      await expect(homePage.page).toHaveURL(/practicesoftwaretesting/);
    });

    await test.step('When user navigates to login and signs in with valid credentials', async () => {
      await homePage.openLogin();
      await loginPage.login(process.env.CUSTOMER_EMAIL, process.env.CUSTOMER_PASSWORD);
    });

    await test.step('Then the user should be authenticated', async () => {
      await loginPage.assertLoginSucceeded();
    });
  });

  for (const invalidUser of loginUsers.invalidUsers) {
    test(`@regression Invalid login is rejected for ${invalidUser.email}`, async ({ loginPage }) => {
      await test.step('Given user is on login page', async () => {
        await loginPage.goto();
      });

      await test.step('When user submits invalid credentials', async () => {
        await loginPage.login(invalidUser.email, invalidUser.password);
      });

      await test.step('Then a validation or authentication error is shown', async () => {
        await loginPage.assertLoginFailed();
      });
    });
  }
});

const { test, expect } = require('../fixtures/base.fixture');
const UserFactory = require('../test-data/factories/user.factory');
const { loadJson } = require('../utils/dataProvider');

const registrationData = loadJson('test-data/registration-scenarios.json');

test.describe('Authentication - Registration', () => {
  test('@e2e @regression New user can register with Faker-generated data', async ({ registerPage }) => {
    const newUser = UserFactory.createStandardUser();

    await test.step('Given user opens registration page', async () => {
      await registerPage.goto();
    });

    await test.step('When user submits valid registration details', async () => {
      await registerPage.register(newUser);
    });

    await test.step('Then registration should succeed', async () => {
      await registerPage.assertRegistrationSucceeded();
    });
  });

  for (const scenario of registrationData.negative) {
    test(`@regression Registration validation fails for ${scenario.title}`, async ({ registerPage }) => {
      const invalidUser = UserFactory.createByRole('standard', {
        strategy: 'static',
        overrides: scenario.overrides
      });

      await test.step('Given user opens registration page', async () => {
        await registerPage.goto();
      });

      await test.step('When user submits invalid registration details', async () => {
        await registerPage.register(invalidUser, { validateRequired: false });
      });

      await test.step('Then validation feedback should be displayed', async () => {
        await registerPage.assertRegistrationFailed(scenario.expectedError);
      });
    });
  }
});

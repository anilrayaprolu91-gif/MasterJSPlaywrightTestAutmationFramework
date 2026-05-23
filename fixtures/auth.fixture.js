const { test: base, expect } = require('./base.fixture');
const env = require('../config/env');
const { getOrCreateStorageState } = require('../utils/authStateManager');
const { normalizeRole, hasCredentials } = require('../config/users');

const test = base.extend({
  role: ['standard', { option: true }],
  refreshAuthState: [false, { option: true }],
  strictRoleAuth: [false, { option: true }],

  resolvedRole: async ({ role }, use) => {
    await use(normalizeRole(role));
  },

  roleCredentialsAvailable: async ({ resolvedRole }, use) => {
    await use(hasCredentials(resolvedRole));
  },

  authStorageStatePath: async (
    { browser, resolvedRole, refreshAuthState, roleCredentialsAvailable, strictRoleAuth },
    use,
    testInfo
  ) => {
    if (resolvedRole !== 'guest' && !roleCredentialsAvailable) {
      const message = `No credentials found for role '${resolvedRole}'.`;

      if (strictRoleAuth) {
        throw new Error(`${message} Enable credentials in .env or set strictRoleAuth to false.`);
      }

      testInfo.annotations.push({
        type: 'auth-warning',
        description: `${message} Running test as guest.`
      });
      await use(undefined);
      return;
    }

    const statePath = await getOrCreateStorageState(browser, env.baseURL, resolvedRole, refreshAuthState);
    await use(statePath);
  },

  storageState: async ({ authStorageStatePath }, use) => {
    // Override Playwright storageState so default page/context fixtures can be role-authenticated.
    await use(authStorageStatePath);
  },

  authenticatedContext: async ({ browser, authStorageStatePath }, use) => {
    const contextOptions = { baseURL: env.baseURL };

    if (authStorageStatePath) {
      contextOptions.storageState = authStorageStatePath;
    }

    const context = await browser.newContext(contextOptions);

    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    const page = await authenticatedContext.newPage();
    await use(page);
  }
});

module.exports = {
  test,
  expect
};

const fs = require('fs');
const path = require('path');
const LoginPage = require('../pages/LoginPage');
const { getUser, normalizeRole, hasCredentials } = require('../config/users');

const AUTH_DIR = path.resolve(process.cwd(), '.auth');

function ensureAuthDirExists() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

function stateFilePath(role) {
  const normalizedRole = normalizeRole(role);
  return path.join(AUTH_DIR, `${normalizedRole}.json`);
}

function isValidStorageStateFile(authFile) {
  if (!fs.existsSync(authFile)) {
    return false;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    const hasCookies = Array.isArray(parsed.cookies) && parsed.cookies.length > 0;
    const hasOrigins = Array.isArray(parsed.origins) && parsed.origins.length > 0;
    if (!hasCookies && !hasOrigins) return false;

    // Check if any JWT token in localStorage is expired
    if (Array.isArray(parsed.origins)) {
      for (const origin of parsed.origins) {
        if (!Array.isArray(origin.localStorage)) continue;
        const tokenItem = origin.localStorage.find(item => item.name === 'auth-token');
        if (!tokenItem) continue;
        try {
          const parts = tokenItem.value.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
            if (payload.exp && Date.now() / 1000 > payload.exp) {
              return false; // Token is expired, force refresh
            }
          }
        } catch {
          // If we can't parse the token, treat as invalid
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

async function createStorageStateForRole(browser, baseURL, role) {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === 'guest') {
    return undefined;
  }

  const credentials = getUser(normalizedRole);
  const context = await browser.newContext({ baseURL });

  try {
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.email, credentials.password);
    await loginPage.assertLoginSucceeded();

    const authFile = stateFilePath(normalizedRole);
    await context.storageState({ path: authFile });
    return authFile;
  } finally {
    await context.close();
  }
}

async function getOrCreateStorageState(browser, baseURL, role, forceRefresh = false) {
  const normalizedRole = normalizeRole(role);

  if (normalizedRole === 'guest') {
    return undefined;
  }

  if (!hasCredentials(normalizedRole)) {
    return undefined;
  }

  ensureAuthDirExists();
  const authFile = stateFilePath(normalizedRole);

  if (!forceRefresh && isValidStorageStateFile(authFile)) {
    return authFile;
  }

  return createStorageStateForRole(browser, baseURL, normalizedRole);
}

module.exports = {
  getOrCreateStorageState
};

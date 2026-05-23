const fs = require('fs');
const path = require('path');
const { expect } = require('@playwright/test');
const { runAxeScan, assertNoCriticalA11yViolations, assertVisualSnapshot } = require('./visual-a11y-helpers');

async function retry(step, retries = 2, delayMs = 500) {
  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      return await step();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempt += 1;
    }
  }

  throw new Error(`[common-helpers] Retry failed after ${retries + 1} attempts: ${lastError.message}`);
}

function createUniqueEmail(prefix = 'qa.user') {
  const suffix = Date.now();
  return `${prefix}.${suffix}@example.com`;
}

function ensureDirExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function resolvePathFromRoot(...segments) {
  return path.resolve(process.cwd(), ...segments);
}

async function assertUrlContains(page, expectedPathFragment) {
  expect(page.url()).toContain(expectedPathFragment);
}

module.exports = {
  retry,
  createUniqueEmail,
  ensureDirExists,
  resolvePathFromRoot,
  assertUrlContains,
  runAxeScan,
  assertNoCriticalA11yViolations,
  assertVisualSnapshot
};

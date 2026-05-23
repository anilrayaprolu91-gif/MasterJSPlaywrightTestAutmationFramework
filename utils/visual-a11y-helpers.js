const { expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function assertVisualSnapshot(page, snapshotName, options = {}) {
  if (!snapshotName || !String(snapshotName).trim()) {
    throw new Error('[visual-a11y-helpers] snapshotName is required for visual assertion.');
  }

  await expect(page).toHaveScreenshot(snapshotName, {
    fullPage: options.fullPage ?? true,
    maxDiffPixelRatio: options.maxDiffPixelRatio ?? 0.02,
    animations: 'disabled',
    ...options
  });
}

async function runAxeScan(page, options = {}) {
  const builder = new AxeBuilder({ page });

  if (Array.isArray(options.include) && options.include.length > 0) {
    for (const selector of options.include) {
      builder.include(selector);
    }
  }

  if (Array.isArray(options.exclude) && options.exclude.length > 0) {
    for (const selector of options.exclude) {
      builder.exclude(selector);
    }
  }

  if (Array.isArray(options.tags) && options.tags.length > 0) {
    builder.withTags(options.tags);
  }

  return builder.analyze();
}

async function assertNoCriticalA11yViolations(page, options = {}) {
  const results = await runAxeScan(page, options);
  const criticalViolations = results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious'
  );

  expect(
    criticalViolations,
    `[visual-a11y-helpers] Accessibility violations found:\n${JSON.stringify(criticalViolations, null, 2)}`
  ).toEqual([]);
}

module.exports = {
  assertVisualSnapshot,
  runAxeScan,
  assertNoCriticalA11yViolations
};

const { test, expect } = require('../fixtures/base.fixture');
const { loadJson } = require('../utils/dataProvider');

const browsingData = loadJson('test-data/product-browsing-scenarios.json');

test.describe('Catalog - Product Browsing', () => {
  for (const term of browsingData.searchTerms) {
    test(`@smoke @regression Search returns products for: ${term}`, async ({ productListingPage }) => {
      await test.step('Given user opens product listing page', async () => {
        await productListingPage.open();
      });

      await test.step(`When user searches for ${term}`, async () => {
        await productListingPage.searchByKeyword(term);
      });

      await test.step('Then at least one product card should be visible', async () => {
        expect(await productListingPage.getVisibleProductCount()).toBeGreaterThan(0);
      });
    });
  }

  test(`@regression Filter can be applied by label: ${browsingData.filterLabel}`, async ({ productListingPage }) => {
    await test.step('Given user opens product listing page', async () => {
      await productListingPage.open();
    });

    await test.step('When user applies a filter', async () => {
      await productListingPage.applyFilterByLabel(browsingData.filterLabel);
    });

    await test.step('Then products should still be visible after filtering', async () => {
      expect(await productListingPage.getVisibleProductCount()).toBeGreaterThan(0);
    });
  });

  for (const sortOption of browsingData.sortOptions) {
    test(`@regression Sorting can be applied: ${sortOption}`, async ({ productListingPage }) => {
      await test.step('Given user opens product listing page', async () => {
        await productListingPage.open();
      });

      await test.step(`When user sorts products by ${sortOption}`, async () => {
        await productListingPage.sortBy(sortOption);
      });

      await test.step('Then product cards should remain visible', async () => {
        await expect(productListingPage.productCards.first()).toBeVisible();
      });
    });
  }
});

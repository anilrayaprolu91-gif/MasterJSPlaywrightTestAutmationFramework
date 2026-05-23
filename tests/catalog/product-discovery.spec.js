const { test, expect } = require('../../fixtures/base.fixture');
const { loadJson } = require('../../utils/dataProvider');

const searchData = loadJson('test-data/search-terms.json');

test.describe('Catalog - Product Discovery', () => {
  test('@smoke @regression Guest can browse product listing', async ({ productListingPage }) => {
    await test.step('Given user opens product listing page', async () => {
      await productListingPage.open();
    });

    await test.step('Then product cards should be visible', async () => {
      await expect(productListingPage.productCards.first()).toBeVisible();
      expect(await productListingPage.getVisibleProductCount()).toBeGreaterThan(0);
    });
  });

  for (const term of searchData.terms) {
    test(`@regression Search returns results for term: ${term}`, async ({ productListingPage }) => {
      await test.step('Given user opens product listing', async () => {
        await productListingPage.open();
      });

      await test.step(`When user searches for ${term}`, async () => {
        await productListingPage.searchByKeyword(term);
      });

      await test.step('Then at least one matching product should remain visible', async () => {
        await expect(productListingPage.productCards.first()).toBeVisible();
      });
    });
  }

  test('@e2e Guest can open product details from listing', async ({ productListingPage, productDetailsPage }) => {
    await test.step('Given user opens product listing', async () => {
      await productListingPage.open();
    });

    await test.step('When user opens the first listed product', async () => {
      const firstProductName = await productListingPage.productNames.first().innerText();
      await productListingPage.openProductByName(firstProductName);
    });

    await test.step('Then product details page should render title and price', async () => {
      await productDetailsPage.waitForPageReady();
    });
  });
});

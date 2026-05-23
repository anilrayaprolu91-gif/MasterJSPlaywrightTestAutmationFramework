const { test, expect } = require('../../fixtures/auth.fixture');
const ProductListingPage = require('../../pages/ProductListingPage');
const ProductDetailsPage = require('../../pages/ProductDetailsPage');
const CartPage = require('../../pages/CartPage');
const LoginPage = require('../../pages/LoginPage');
const { getUser } = require('../../config/users');
const { loadJson } = require('../../utils/dataProvider');

const products = loadJson('test-data/products.json');

test.describe('Cart - Authenticated user', () => {
  test.use({ role: 'customer' });

  test('@e2e @regression Authenticated user can add product to cart and manage quantity', async ({ authenticatedPage }) => {
    const productListingPage = new ProductListingPage(authenticatedPage);
    const productDetailsPage = new ProductDetailsPage(authenticatedPage);
    const cartPage = new CartPage(authenticatedPage);

    await test.step('Given authenticated user opens a product details page', async () => {
      const productName = products.cartScenario.productName;
      await productListingPage.open();
      await productListingPage.openProductByName(productName);
      await productDetailsPage.waitForPageReady();
    });

    await test.step('When user adds product to cart with quantity from data', async () => {
      await productDetailsPage.addToCart(products.cartScenario.quantity);
    });

    await test.step('Then user should see cart updated and can edit cart items', async () => {
      await cartPage.open();
      expect(await cartPage.getItemCount()).toBeGreaterThan(0);
      await cartPage.updateFirstItemQuantity(1);
      await cartPage.removeFirstItem();
    });
  });
});

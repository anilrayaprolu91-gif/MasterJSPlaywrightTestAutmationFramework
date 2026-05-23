const { test, expect } = require('../fixtures/auth.fixture');
const ProductListingPage = require('../pages/ProductListingPage');
const ProductDetailsPage = require('../pages/ProductDetailsPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const LoginPage = require('../pages/LoginPage');
const { getUser } = require('../config/users');
const { loadJson } = require('../utils/dataProvider');

const checkoutData = loadJson('test-data/checkout-scenario.json');

test.describe('Cart and Checkout - Happy Path', () => {
  test.use({ role: checkoutData.role, strictRoleAuth: true });

  test('@smoke @e2e Authenticated user completes checkout flow', async ({ page }) => {
    const listingPage = new ProductListingPage(page);
    const detailsPage = new ProductDetailsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await test.step('Given authenticated user opens product listing', async () => {
      await listingPage.open();
    });

    await test.step('When user selects product and adds it to cart', async () => {
      await listingPage.openProductByName(checkoutData.productName);
      await detailsPage.waitForPageReady();
      await detailsPage.addToCart(checkoutData.quantity);
    });

    await test.step('And user reviews cart before checkout', async () => {
      await cartPage.open();
      expect(await cartPage.getItemCount()).toBeGreaterThan(0);
    });

    await test.step('And user proceeds through checkout payment step', async () => {
      await checkoutPage.openCartAndProceed();
      await checkoutPage.selectPaymentMethod(checkoutData.paymentMethod);
      await checkoutPage.placeOrder();
    });

    await test.step('Then order confirmation should be visible', async () => {
      await checkoutPage.assertOrderPlaced();
    });
  });
});

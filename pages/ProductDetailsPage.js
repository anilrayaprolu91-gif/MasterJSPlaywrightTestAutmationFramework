const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductDetailsPage extends BasePage {
  #productTitle;
  #productPrice;
  #quantityInput;
  #addToCartButton;
  #successToast;

  constructor(page) {
    super(page);
    this.#productTitle = page.locator('[data-test="product-name"], h1').first();
    this.#productPrice = page.locator('[data-test="product-price"]').first();
    this.#quantityInput = page.locator('[data-test="product-quantity"], input[type="number"]').first();
    this.#addToCartButton = page.locator('[data-test="add-to-cart"]').or(page.getByRole('button', { name: /add to cart/i })).first();
    this.#successToast = page.locator('[data-test="toast-success"]').or(page.getByText(/added to cart|success/i)).first();
  }

  async waitForPageReady() {
    await expect(this.#productTitle).toBeVisible();
  }

  async addToCart(quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('[ProductDetailsPage] quantity must be a positive integer.');
    }

    if (quantity > 1) {
      await this.fill(this.#quantityInput, String(quantity), 'product quantity input');
    }

    await this.click(this.#addToCartButton, 'add to cart button');

    // Wait for toast confirmation or cart badge update
    const toast = this.page.locator('.toast, [class*="toast"]').first();
    await expect(toast.or(this.page.locator('[data-test="cart-quantity"]')).first())
      .toBeVisible({ timeout: 10000 });
  }

  async assertAddedToCartFeedback() {
    await expect(this.#successToast).toBeVisible();
  }

  async getProductTitle() {
    return this.getText(this.#productTitle, 'product title');
  }

  get productTitle() {
    return this.#productTitle;
  }
}

module.exports = ProductDetailsPage;

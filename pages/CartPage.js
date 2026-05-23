const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
  #cartItems;
  #quantityInputs;
  #removeButtons;
  #checkoutStepper;
  #emptyCartMessage;

  constructor(page) {
    super(page);
    this.#cartItems = page.locator('[data-test="product-title"]');
    this.#quantityInputs = page.locator('[data-test="product-quantity"]');
    this.#removeButtons = page.locator('.btn-danger');
    this.#checkoutStepper = page.getByText(/cart|sign in|billing address|payment/i).first();
    this.#emptyCartMessage = page.getByText(/cart is empty|nothing to display/i).first();
  }

  async open() {
    // Navigate via header cart link to preserve session context rather than
    // doing a cold navigation which can lose the server-side cart session.
    const cartLink = this.page.locator('[data-test="nav-cart"]').first();
    if (await cartLink.isVisible()) {
      await cartLink.click();
    } else {
      await this.goto('/checkout');
    }
    await expect(this.#checkoutStepper).toBeVisible({ timeout: 15000 });
    // Wait for cart content to load: either items or empty message
    await expect(this.#cartItems.first().or(this.#emptyCartMessage))
      .toBeVisible({ timeout: 10000 });
  }

  async getItemCount() {
    return this.getCount(this.#cartItems, 'cart items');
  }

  async updateFirstItemQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('[CartPage] quantity must be a positive integer.');
    }

    await this.fill(this.#quantityInputs.first(), String(quantity), 'first cart item quantity');
    await this.page.keyboard.press('Enter');
  }

  async removeFirstItem() {
    const itemCount = await this.getItemCount();
    if (itemCount === 0) {
      throw new Error('[CartPage] Cannot remove item from an empty cart.');
    }

    await this.click(this.#removeButtons.first(), 'first remove button');
  }

  async assertEmptyCart() {
    await expect(this.#emptyCartMessage).toBeVisible();
  }

  get cartItems() {
    return this.#cartItems;
  }
}

module.exports = CartPage;

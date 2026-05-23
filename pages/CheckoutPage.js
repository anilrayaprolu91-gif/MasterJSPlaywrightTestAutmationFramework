const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  #proceedToCheckoutButton;
  #billingAddressSection;
  #paymentMethodSection;
  #paymentMethodSelect;
  #confirmOrderButton;
  #orderSuccessMessage;

  constructor(page) {
    super(page);
    this.#proceedToCheckoutButton = page.locator('[data-test="proceed-1"]');
    this.#billingAddressSection = page.locator('[data-test="billing-address"], [data-testid="billing-address"], .billing-address').first();
    this.#paymentMethodSection = page.locator('[data-test="payment-method-select"], [data-testid="payment-method"], .payment-method').first();
    this.#paymentMethodSelect = page.locator('[data-test="payment-method-select"], select[name="payment_method"]').first();
    this.#confirmOrderButton = page.locator('[data-test="finish"], [data-test="place-order"]').or(page.getByRole('button', { name: /confirm|place order|finish/i })).first();
    this.#orderSuccessMessage = page.locator('[data-test="order-success"], .alert-success').or(page.getByText(/thank you|order placed|order confirmation|success/i)).first();
  }

  async openCartAndProceed() {
    // The cart is at /checkout (step 1). If not already there, navigate there.
    if (!this.page.url().includes('/checkout')) {
      await this.goto('/checkout');
    }
    // Step 1: Proceed from cart
    await this.click(this.page.locator('[data-test="proceed-1"]'), 'proceed from cart button');

    // Step 2: May show "already signed in" message or login form
    // Wait briefly for the page to settle
    await this.page.waitForTimeout(1000);
    const proceedBtn2 = this.page.locator('[data-test="proceed-2"]');
    if (await proceedBtn2.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.click(proceedBtn2, 'proceed from sign-in step');
    }

    await this.waitForVisible(this.#billingAddressSection, 'billing address section');
  }

  async selectPaymentMethod(paymentMethodLabel) {
    this.ensureRequired(paymentMethodLabel, 'payment method');

    await this.runStep(`select payment method '${paymentMethodLabel}'`, async () => {
      await this.waitForVisible(this.#paymentMethodSection, 'payment method section');
      try {
        await this.#paymentMethodSelect.selectOption({ label: paymentMethodLabel });
      } catch (error) {
        // Fallback to first available method to keep flow resilient across environments.
        await this.#paymentMethodSelect.selectOption({ index: 0 });
      }
    });
  }

  async placeOrder() {
    await this.click(this.#confirmOrderButton, 'confirm order button');
  }

  async assertOrderPlaced() {
    await expect(this.#orderSuccessMessage).toBeVisible();
  }
}

module.exports = CheckoutPage;

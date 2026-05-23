const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class RegisterPage extends BasePage {
  #firstNameInput;
  #lastNameInput;
  #dobInput;
  #streetInput;
  #houseNumberInput;
  #postalCodeInput;
  #cityInput;
  #stateInput;
  #countrySelect;
  #phoneInput;
  #emailInput;
  #passwordInput;
  #registerButton;
  #errorMessage;

  constructor(page) {
    super(page);
    this.#firstNameInput = page.getByTestId('first_name').or(page.locator('#first_name')).first();
    this.#lastNameInput = page.getByTestId('last_name').or(page.locator('#last_name')).first();
    this.#dobInput = page.getByTestId('dob').or(page.locator('#dob')).first();
    this.#streetInput = page.getByTestId('street').or(page.locator('#street')).first();
    this.#houseNumberInput = page.getByTestId('house_number').or(page.locator('#house_number')).first();
    this.#postalCodeInput = page.getByTestId('postal_code').or(page.locator('#postal_code')).first();
    this.#cityInput = page.getByTestId('city').or(page.locator('#city')).first();
    this.#stateInput = page.getByTestId('state').or(page.locator('#state')).first();
    this.#countrySelect = page.getByTestId('country').or(page.locator('#country')).first();
    this.#phoneInput = page.getByTestId('phone').or(page.locator('#phone')).first();
    this.#emailInput = page.getByTestId('email').or(page.locator('#email')).first();
    this.#passwordInput = page.getByTestId('password').or(page.locator('#password')).first();
    this.#registerButton = page.locator('[data-test="register-submit"]');
    this.#errorMessage = page
      .locator('[role="alert"], .alert-danger, .invalid-feedback, [data-testid="validation-error"]')
      .first();
  }

  async goto() {
    await super.goto('/auth/register');
    await this.waitForVisible(this.#registerButton, 'register button');
  }

  async register(user, options = {}) {
    const { validateRequired = true } = options;
    const requiredFields = ['firstName', 'lastName', 'street', 'postalCode', 'city', 'country', 'phone', 'email', 'password'];

    if (validateRequired) {
      for (const field of requiredFields) {
        this.ensureRequired(user[field], field);
      }
    }

    await this.runStep('register new user', async () => {
      await this.fill(this.#firstNameInput, user.firstName, 'first name input');
      await this.fill(this.#lastNameInput, user.lastName, 'last name input');

      if (user.dateOfBirth) {
        await this.fill(this.#dobInput, user.dateOfBirth, 'date of birth input');
      }

      await this.fill(this.#streetInput, user.street, 'street input');

      if (user.houseNumber !== undefined) {
        await this.fill(this.#houseNumberInput, String(user.houseNumber), 'house number input');
      }

      await this.fill(this.#postalCodeInput, user.postalCode, 'postal code input');
      await this.fill(this.#cityInput, user.city, 'city input');

      if (user.state) {
        await this.fill(this.#stateInput, user.state, 'state input');
      }

      if (user.country) {
        await this.#countrySelect.selectOption({ label: user.country });
      }

      if (user.phone !== undefined) {
        await this.fill(this.#phoneInput, user.phone, 'phone input');
      }

      if (user.email !== undefined) {
        await this.fill(this.#emailInput, user.email, 'email input');
      }

      if (user.password !== undefined) {
        await this.fill(this.#passwordInput, user.password, 'password input');
      }

      await this.click(this.#registerButton, 'register button');
    });
  }

  async assertRegistrationSucceeded() {
    await this.page.waitForURL(/auth\/login/, { timeout: 15000 });
  }

  async assertRegistrationFailed(expectedMessage) {
    if (expectedMessage) {
      await expect(this.page.getByText(new RegExp(expectedMessage, 'i')).first()).toBeVisible();
      return;
    }

    await expect(this.#errorMessage).toBeVisible();
  }
}

module.exports = RegisterPage;

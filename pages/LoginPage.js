const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  #emailInput;
  #passwordInput;
  #loginButton;
  #loginSuccessMarker;
  #loginErrorMessage;

  constructor(page) {
    super(page);
    this.#emailInput = page.locator('[data-test="email"]').or(page.locator('#email')).first();
    this.#passwordInput = page.locator('[data-test="password"]').or(page.locator('#password')).first();
    this.#loginButton = page.locator('[data-test="login-submit"]');
    this.#loginSuccessMarker = page.locator('[data-test="nav-menu"]');
    this.#loginErrorMessage = page.locator('[data-test="login-error"]');
  }

  async goto() {
    await super.goto('/auth/login');
    await this.waitForVisible(this.#loginButton, 'login button');
  }

  async login(email, password) {
    this.ensureRequired(email, 'email');
    this.ensureRequired(password, 'password');

    await this.runStep('authenticate user', async () => {
      await this.fill(this.#emailInput, email, 'email input');
      await this.fill(this.#passwordInput, password, 'password input');
      await this.click(this.#loginButton, 'login button');
    });
  }

  async assertLoginSucceeded() {
    await expect(this.#loginSuccessMarker).toBeVisible();
  }

  async assertLoginFailed() {
    const loginError = this.page.locator('[data-test="login-error"]');
    const emailError = this.page.locator('[data-test="email-error"]');
    await expect(loginError.or(emailError).first()).toBeVisible();
  }

  get emailInput() {
    return this.#emailInput;
  }

  get passwordInput() {
    return this.#passwordInput;
  }
}

module.exports = LoginPage;

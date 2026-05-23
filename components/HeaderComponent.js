const BasePage = require('../pages/BasePage');

class HeaderComponent extends BasePage {
  #signInLink;
  #cartButton;
  #accountMenu;
  #signOutButton;
  #loggedInMarker;

  constructor(page) {
    super(page);
    this.#signInLink = page.locator('[data-test="nav-sign-in"]').first();
    this.#cartButton = page.locator('[data-test="nav-cart"]').first();
    this.#accountMenu = page.locator('[data-test="nav-menu"]').first();
    this.#signOutButton = page.locator('[data-test="nav-sign-out"]').first();
    this.#loggedInMarker = page.locator('[data-test="nav-menu"]').first();
  }

  async goToLogin() {
    await this.click(this.#signInLink, 'header sign in link');
  }

  async goToCart() {
    await this.click(this.#cartButton, 'header cart link');
  }

  async isUserLoggedIn() {
    return this.isVisible(this.#loggedInMarker, 'logged in marker');
  }
}

module.exports = HeaderComponent;

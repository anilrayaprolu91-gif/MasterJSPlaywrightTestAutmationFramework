const BasePage = require('./BasePage');
const HeaderComponent = require('../components/HeaderComponent');

class HomePage extends BasePage {
  #searchInput;
  #productCards;
  #pageTitle;

  constructor(page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.#searchInput = page.getByPlaceholder(/search/i).first();
    this.#productCards = page.locator('[data-testid="product-card"], .card');
    this.#pageTitle = page.locator('[data-test="search-query"]').first();
  }

  async open() {
    await this.goto('/');
    await this.waitForVisible(this.#pageTitle, 'home page title');
    await this.waitForVisible(this.#productCards.first(), 'first product card');
  }

  async searchFor(text) {
    this.ensureRequired(text, 'search text');
    await this.fill(this.#searchInput, text, 'home search input');
  }

  async openLogin() {
    await this.runStep('open login from home page', async () => {
      await this.header.goToLogin();
    });
  }

  async getVisibleProductCount() {
    return this.getCount(this.#productCards, 'product cards');
  }

  get searchInput() {
    return this.#searchInput;
  }
}

module.exports = HomePage;

const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductListingPage extends BasePage {
  #productCards;
  #productNames;
  #searchInput;
  #filterContainer;
  #sortSelect;

  constructor(page) {
    super(page);
    this.#productCards = page.locator('[data-test^="product-"], .card');
    this.#productNames = page.locator('[data-test="product-name"]');
    this.#searchInput = page.locator('[data-test="search-query"]').first();
    this.#filterContainer = page.locator('div[data-test="filters"]').first();
    this.#sortSelect = page.locator('[data-test="sort"]').first();
  }

  async open() {
    await this.goto('/');
    await expect(this.#productCards.first()).toBeVisible();
  }

  async searchByKeyword(keyword) {
    this.ensureRequired(keyword, 'search keyword');
    await this.fill(this.#searchInput, keyword, 'listing search input');
  }

  async openProductByName(name) {
    this.ensureRequired(name, 'product name');
    const product = this.page.getByRole('link', { name: new RegExp(name, 'i') }).first();
    await this.click(product, `product link '${name}'`);
  }

  async getVisibleProductCount() {
    return this.getCount(this.#productCards, 'visible product cards');
  }

  async applyFilterByLabel(filterLabel) {
    this.ensureRequired(filterLabel, 'filter label');

    await this.runStep(`apply product filter '${filterLabel}'`, async () => {
      await this.waitForVisible(this.#filterContainer, 'filter container');

      // Brands load async — wait for any brand checkbox to appear first
      const anyBrandCheckbox = this.#filterContainer.locator('[data-test^="brand-"]').first();
      await anyBrandCheckbox.waitFor({ state: 'attached', timeout: 15000 });

      const checkbox = this.#filterContainer
        .getByRole('checkbox', { name: new RegExp(filterLabel, 'i') })
        .first();

      if ((await checkbox.count()) > 0) {
        await checkbox.check();
        return;
      }

      const filterLabelTarget = this.#filterContainer.getByText(new RegExp(filterLabel, 'i')).first();
      if ((await filterLabelTarget.count()) > 0) {
        await filterLabelTarget.click();
        return;
      }

      throw new Error(`Filter option '${filterLabel}' was not found.`);
    });
  }

  async sortBy(optionLabel) {
    this.ensureRequired(optionLabel, 'sort option');

    await this.runStep(`sort products by '${optionLabel}'`, async () => {
      await this.waitForVisible(this.#sortSelect, 'sort dropdown');
      await this.#sortSelect.selectOption({ label: optionLabel });
    });
  }

  async getVisibleProductNames() {
    const rawNames = await this.#productNames.allTextContents();
    return rawNames.map((name) => name.trim()).filter(Boolean);
  }

  get productCards() {
    return this.#productCards;
  }

  get productNames() {
    return this.#productNames;
  }

  get filterContainer() {
    return this.#filterContainer;
  }
}

module.exports = ProductListingPage;

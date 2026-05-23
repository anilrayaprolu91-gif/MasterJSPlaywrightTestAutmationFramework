class BasePage {
  constructor(page) {
    if (!page) {
      throw new Error('A valid Playwright page instance is required to initialize a page object.');
    }

    this.page = page;
  }

  async runStep(stepName, action) {
    try {
      return await action();
    } catch (error) {
      throw new Error(`[${this.constructor.name}] ${stepName} failed: ${error.message}`);
    }
  }

  async goto(path = '/', options = {}) {
    return this.runStep(`navigate to ${path}`, async () => {
      await this.page.goto(path, { waitUntil: 'domcontentloaded', ...options });
    });
  }

  async click(locator, description = 'element') {
    return this.runStep(`click ${description}`, async () => {
      await locator.click();
    });
  }

  async fill(locator, value, description = 'input') {
    return this.runStep(`fill ${description}`, async () => {
      await locator.fill(String(value));
    });
  }

  async type(locator, value, description = 'input') {
    return this.runStep(`type into ${description}`, async () => {
      await locator.clear();
      await locator.type(String(value));
    });
  }

  async waitForVisible(locator, description = 'element') {
    return this.runStep(`wait for ${description} to be visible`, async () => {
      await locator.waitFor({ state: 'visible' });
    });
  }

  async waitForHidden(locator, description = 'element') {
    return this.runStep(`wait for ${description} to be hidden`, async () => {
      await locator.waitFor({ state: 'hidden' });
    });
  }

  async getText(locator, description = 'element') {
    return this.runStep(`read text from ${description}`, async () => {
      return (await locator.textContent())?.trim() || '';
    });
  }

  async getCount(locator, description = 'elements') {
    return this.runStep(`count ${description}`, async () => {
      return locator.count();
    });
  }

  async isVisible(locator, description = 'element') {
    return this.runStep(`check visibility for ${description}`, async () => {
      return locator.isVisible();
    });
  }

  ensureRequired(value, fieldName) {
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new Error(`[${this.constructor.name}] '${fieldName}' is required.`);
    }
  }
}

module.exports = BasePage;

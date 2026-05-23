# Playwright Test Automation Framework (JavaScript)

Production-grade Playwright framework for the Toolshop demo e-commerce app:
https://practicesoftwaretesting.com

This framework is designed for Senior Automation Engineer portfolio usage with a scalable architecture, strong Page Object Model (POM), role-based authentication fixture, data-driven testing, and CI integration.

## Project Overview

Key capabilities:

- Playwright Test (latest) with JavaScript (ES6+)
- Strong POM with a reusable BasePage
- Custom fixtures for reusable test context
- Role-based auth with storageState (standard, admin, guest)
- Data-driven testing with static JSON and Faker generators
- Tagging support: @smoke, @regression, @e2e
- Visual testing helper using Playwright screenshot assertions
- Accessibility helper using axe-core
- Parallel execution and multi-project browser matrix
- GitHub Actions CI workflow for push and pull requests

## Tech Stack

- Node.js 20+
- @playwright/test
- JavaScript (test and framework code)
- TypeScript Playwright config file
- dotenv
- @faker-js/faker
- @axe-core/playwright

## Setup Instructions

1. Clone and open the project

```bash
git clone <your-repo-url>
cd TestAutmationPlaywrightJs
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

Copy values from .env.example into a new .env file and set valid credentials.

Required for authenticated flows:

- STANDARD_USER_EMAIL
- STANDARD_USER_PASSWORD

Optional:

- ADMIN_EMAIL
- ADMIN_PASSWORD
- BASE_URL

4. Install Playwright browsers (if needed)

```bash
npx playwright install --with-deps
```

## How To Run Tests

Run all tests:

```bash
npm test
```

Run with headed browser:

```bash
npm run test:headed
```

Run by tags:

```bash
npm run test:smoke
npm run test:regression
npm run test:e2e
```

Run UI mode:

```bash
npm run test:ui
```

Run a single spec file:

```bash
npx playwright test tests/login.spec.js
npx playwright test tests/product-browsing.spec.js
npx playwright test tests/cart-and-checkout.spec.ts
npx playwright test tests/registration.spec.js
```

Run specific project:

```bash
npx playwright test --project=chrome
npx playwright test --project=firefox
npx playwright test --project=mobile-chrome
```

List discovered tests:

```bash
npx playwright test --list
```

Open last HTML report:

```bash
npm run report
```

## Framework Architecture

### 1) Page Object Model

- BasePage centralizes reusable wrappers (navigate, fill, click, waits, validation, error context)
- Each business page object encapsulates page behavior
- Locators are private class fields to reduce test-level selector leakage

Core page objects:

- HomePage
- LoginPage
- RegisterPage
- ProductListingPage
- ProductDetailsPage
- CartPage
- CheckoutPage

### 2) Fixtures

- base.fixture.js
  - Provides common page object fixtures
- auth.fixture.js
  - Supports role-based auth with storageState reuse
  - Handles standard, admin, and guest role behavior
  - Supports strict auth mode when credentials are required

### 3) Data Layer

- Static JSON files for deterministic, versioned datasets
- Faker-based generators for unique runtime data
- Factory pattern for role-specific user generation

### 4) Utilities

- api-utils.ts for APIRequestContext workflows
- common-helpers.js for retries, path utilities, URL assertions
- visual-a11y-helpers.js for screenshot and axe assertions
- data-generator.js for dynamic test object generation

### 5) Execution and Reporting

- playwright.config.ts with .env-based baseURL
- Multi-project execution:
  - chrome
  - firefox
  - mobile-chrome
- Artifacts on failure:
  - Trace
  - Screenshot
  - Video
- Reporters:
  - List
  - HTML
  - JSON

## Folder Structure

```text
.
|-- .auth/
|-- .github/
|   `-- workflows/
|       `-- ci.yml
|-- components/
|   `-- HeaderComponent.js
|-- config/
|   |-- env.js
|   `-- users.js
|-- fixtures/
|   |-- auth.fixture.js
|   `-- base.fixture.js
|-- pages/
|   |-- BasePage.js
|   |-- CartPage.js
|   |-- CheckoutPage.js
|   |-- HomePage.js
|   |-- LoginPage.js
|   |-- ProductDetailsPage.js
|   |-- ProductListingPage.js
|   `-- RegisterPage.js
|-- test-data/
|   |-- factories/
|   |   `-- user.factory.js
|   |-- checkout-scenario.json
|   |-- login-scenarios.json
|   |-- product-browsing-scenarios.json
|   |-- registration-scenarios.json
|   |-- users.static.json
|   `-- (additional JSON datasets)
|-- tests/
|   |-- auth/
|   |   `-- login.spec.js
|   |-- catalog/
|   |   `-- product-discovery.spec.js
|   |-- e2e/
|   |   `-- cart-authenticated.spec.js
|   |-- cart-and-checkout.spec.ts
|   |-- login.spec.js
|   |-- product-browsing.spec.js
|   `-- registration.spec.js
|-- utils/
|   |-- api-utils.ts
|   |-- authStateManager.js
|   |-- common-helpers.js
|   |-- data-generator.js
|   |-- dataProvider.js
|   `-- visual-a11y-helpers.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- playwright.config.ts
`-- README.md
```

## How To Add New Tests

1. Create or extend a JSON dataset in test-data for data-driven scenarios.
2. Build or update POM business methods first (avoid raw selectors in spec files).
3. Add a new test file under tests/ with a domain-based naming convention.
4. Use test.describe and test.step for readable test narratives.
5. Apply tags in test titles: @smoke, @regression, @e2e.
6. Reuse fixtures from base.fixture.js or auth.fixture.js.
7. Run locally and validate reports before pushing.

Example skeleton:

```javascript
const { test, expect } = require("../fixtures/base.fixture");

test.describe("Feature - Example", () => {
  test("@regression Scenario title", async ({ homePage }) => {
    await test.step("Given something", async () => {
      await homePage.open();
    });

    await test.step("Then something is verified", async () => {
      await expect(homePage.searchInput).toBeVisible();
    });
  });
});
```

## How To Add New Page Objects

1. Create a new class under pages/ that extends BasePage.
2. Keep locators private and expose only meaningful business methods.
3. Add input validation and descriptive error handling.
4. Add new fixture registration in fixtures/base.fixture.js if needed.
5. Use the new object in tests via fixtures or direct initialization.

Recommended template:

```javascript
const BasePage = require("./BasePage");

class ExamplePage extends BasePage {
  #importantElement;

  constructor(page) {
    super(page);
    this.#importantElement = page.getByTestId("important-element");
  }

  async open() {
    await this.goto("/example");
    await this.waitForVisible(this.#importantElement, "important element");
  }
}

module.exports = ExamplePage;
```

## CI Pipeline

GitHub Actions workflow is configured at:

- .github/workflows/ci.yml

It runs on push and pull request, installs dependencies/browsers, executes Playwright tests, and uploads test artifacts.

## Best Practices Used In This Framework

- Business-focused test steps, not selector-heavy specs
- Data-driven tests for coverage and maintainability
- Role-aware auth fixture for stable authenticated scenarios
- Artifact retention for fast debugging
- Parallel-first execution design
- Utilities for API, visual, and accessibility validation

## Troubleshooting

If no authenticated tests run as expected:

- Ensure .env has valid STANDARD_USER_EMAIL and STANDARD_USER_PASSWORD.
- Use strict role auth in tests when credentials are mandatory.

If snapshot tests fail:

- Verify UI change is expected before updating snapshots.

If a11y tests fail:

- Review violation details and fix critical/serious issues first.

## Notes

- Some demo-site behaviors may vary between deployments. This framework is built with resilient locators and fallback handling to reduce instability.

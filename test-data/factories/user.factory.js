const path = require('path');
const { faker } = require('@faker-js/faker');
const { loadJson } = require('../../utils/dataProvider');

const STATIC_USERS_PATH = path.join('test-data', 'users.static.json');

class UserFactory {
  static #defaultCountry = 'United States of America (the)';

  static createStandardUser(overrides = {}) {
    return this.#createFakerUser(overrides);
  }

  static createAdminUser(overrides = {}) {
    return this.#createFakerUser({
      email: `admin.${faker.string.alphanumeric(8).toLowerCase()}@example.com`,
      ...overrides
    });
  }

  static createByRole(role = 'standard', options = {}) {
    const normalizedRole = String(role).toLowerCase().trim();
    const strategy = options.strategy || 'faker';
    const overrides = options.overrides || {};

    if (strategy === 'static') {
      return this.getStaticUser(normalizedRole, overrides);
    }

    if (normalizedRole === 'admin') {
      return this.createAdminUser(overrides);
    }

    return this.createStandardUser(overrides);
  }

  static getStaticUser(role = 'standard', overrides = {}) {
    const staticUsers = loadJson(STATIC_USERS_PATH);
    const user = staticUsers[role];

    if (!user) {
      throw new Error(
        `[UserFactory] Role '${role}' not found in ${STATIC_USERS_PATH}. Available roles: ${Object.keys(staticUsers).join(', ')}`
      );
    }

    return {
      ...user,
      ...overrides
    };
  }

  static #createFakerUser(overrides = {}) {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date
        .birthdate({ min: 21, max: 60, mode: 'age' })
        .toISOString()
        .slice(0, 10),
      street: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      country: this.#defaultCountry,
      phone: faker.string.numeric(10),
      houseNumber: faker.string.numeric({ min: 1, max: 3 }),
      email: `qa.${faker.string.alphanumeric(10).toLowerCase()}@example.com`,
        password: 'T3stQa@' + faker.string.alphanumeric(8),
      ...overrides
    };
  }
}

module.exports = UserFactory;

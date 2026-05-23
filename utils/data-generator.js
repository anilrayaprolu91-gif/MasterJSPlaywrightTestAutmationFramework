const { faker } = require('@faker-js/faker');

class DataGenerator {
  static generateUser(overrides = {}) {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 21, max: 60, mode: 'age' }).toISOString().slice(0, 10),
      street: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      country: 'United States of America (the)',
      phone: faker.phone.number('+1-###-###-####'),
      email: `qa.${faker.string.alphanumeric(10).toLowerCase()}@example.com`,
      password: 'Password123!',
      ...overrides
    };
  }

  static generateAddress(overrides = {}) {
    return {
      street: faker.location.streetAddress(),
      postalCode: faker.location.zipCode(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      country: 'United States of America (the)',
      ...overrides
    };
  }

  static generateSearchTerm(overrides = {}) {
    const noun = faker.commerce.productMaterial();
    return {
      keyword: noun.toLowerCase(),
      ...overrides
    };
  }

  static generateNumericRange(min = 1, max = 10) {
    return faker.number.int({ min, max });
  }
}

module.exports = DataGenerator;

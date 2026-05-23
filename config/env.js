const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
  isCI: process.env.CI === 'true'
};

module.exports = env;

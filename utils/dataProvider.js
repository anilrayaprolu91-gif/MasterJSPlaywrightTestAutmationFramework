const fs = require('fs');
const path = require('path');

const cache = new Map();

function loadJson(relativePath) {
  const fullPath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Test data file not found: ${fullPath}`);
  }

  if (cache.has(fullPath)) {
    return cache.get(fullPath);
  }

  const parsed = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  cache.set(fullPath, parsed);
  return parsed;
}

module.exports = {
  loadJson
};

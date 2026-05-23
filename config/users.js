const roleAliases = {
  standard: 'standard',
  user: 'standard',
  customer: 'standard',
  admin: 'admin',
  guest: 'guest'
};

const users = {
  standard: {
    email: process.env.STANDARD_USER_EMAIL || process.env.CUSTOMER_EMAIL,
    password: process.env.STANDARD_USER_PASSWORD || process.env.CUSTOMER_PASSWORD
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  },
  guest: {
    email: null,
    password: null
  }
};

function normalizeRole(role) {
  const normalizedInput = String(role || 'standard').toLowerCase().trim();
  const normalizedRole = roleAliases[normalizedInput];

  if (!normalizedRole) {
    throw new Error(
      `Unsupported role: ${role}. Supported roles: ${Object.keys(roleAliases).join(', ')}`
    );
  }

  return normalizedRole;
}

function hasCredentials(role) {
  const normalizedRole = normalizeRole(role);
  const user = users[normalizedRole];

  return Boolean(user?.email && user?.password);
}

function getUser(role, options = {}) {
  const { allowMissingCredentials = false } = options;
  const normalizedRole = normalizeRole(role);
  const user = users[normalizedRole];

  if (!user) {
    throw new Error(`No user mapping found for role '${normalizedRole}'.`);
  }

  if (normalizedRole === 'guest') {
    return user;
  }

  if (!user.email || !user.password) {
    if (allowMissingCredentials) {
      return null;
    }

    throw new Error(
      `Missing credentials for role '${normalizedRole}'. Set ${normalizedRole.toUpperCase()}_USER_EMAIL and ${normalizedRole.toUpperCase()}_USER_PASSWORD (or CUSTOMER_EMAIL/CUSTOMER_PASSWORD for standard role) in .env`
    );
  }

  return user;
}

module.exports = {
  users,
  normalizeRole,
  hasCredentials,
  getUser
};

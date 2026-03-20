const dotenv = require('dotenv');

dotenv.config();

// Prevent hardcoded credentials fallback
const adminUser = process.env.ADMIN_USER;
const adminPass = process.env.ADMIN_PASS;

if (!adminUser && process.env.REQUIRE_AUTH === 'true') {
  throw new Error('FATAL: [Config] Missing ADMIN_USER in environment variables. Hardcoded credentials are not allowed.');
}

const config = {
  adminUser,
  adminPass,
  timeout: parseInt(process.env.TIMEOUT || '30000', 10),
  validationDuration: parseInt(process.env.VALIDATION_DURATION || '10000', 10),
};

module.exports = config;
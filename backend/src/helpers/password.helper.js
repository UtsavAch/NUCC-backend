const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function comparePassword(raw, hash) {
  return bcrypt.compare(raw, hash);
}

module.exports = {
  hashPassword,
  comparePassword,
};

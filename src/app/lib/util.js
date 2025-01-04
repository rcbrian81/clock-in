const bcrypt = require("bcrypt");

export async function hashPassword(password) {
  const saltRounds = 10; // Number of hashing rounds
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

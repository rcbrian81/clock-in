const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10; // Number of hashing rounds
  const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);
  return hashedPassword;
}

(async () => {
  try {
    console.log(await hashPassword(1234));
    console.log(await hashPassword(4321));
  } catch (error) {
    console.error("Error hashing password:", error);
  }
})();

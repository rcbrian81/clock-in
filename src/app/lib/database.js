// lib/database.js

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const insertSession = async (sessionID, expiresAt) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(
    "INSERT INTO sessionsTable (sessionID, expiresAt) VALUES (?, ?)"
  );
  await stmt.run(sessionID, expiresAt);
  console.log(`Session with ID ${sessionID} inserted.`);
  await stmt.finalize();
  await db.close();
};

// Export the insertSession function
module.exports = { insertSession };

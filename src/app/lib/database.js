// lib/database.js

const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const downGrade = async (sessionID) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const query = `UPDATE SessionsTable SET admin = 0 WHERE sessionID = ?`;
  const result = await db.run(query, sessionID);

  console.log(`Rows updated: ${result.changes}`);
};
const insertSession = async (sessionID, admin, expiresAt) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(
    "INSERT INTO sessionsTable (sessionID, admin,expiresAt) VALUES (?, ?,?)"
  );
  await stmt.run(sessionID, admin, expiresAt);
  console.log(`Session with ID ${sessionID} inserted.`);
  await stmt.finalize();
  await db.close();
};

const getPermissionLvl = async (sessionID) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const query = `SELECT expiresAt, admin FROM sessionsTable WHERE sessionID = ?`;
  const result = await db.get(query, sessionID);

  if (!result) {
    console.log("Session does not exist.");
    await db.close();
    return 0;
  }

  const now = new Date();
  const expiresAt = new Date(result.expiresAt);

  if (expiresAt < now) {
    console.log("Session has expired.");
    const deleteStmt = await db.prepare(
      "DELETE FROM sessionsTable WHERE sessionID = ?"
    );
    await deleteStmt.run(sessionID);
    await deleteStmt.finalize();
    await db.close();
    return 0;
  }

  console.log("Session is valid.");
  await db.close();
  return result.admin + 1;
};

// Export the functions
module.exports = { insertSession, getPermissionLvl, downGrade };

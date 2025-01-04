const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const getEmployees = async () => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    // Query to fetch all employee names
    const query = "SELECT name FROM Employees";
    const employees = await db.all(query);
    await db.close();

    return employees; // Returns an array of employees
  } catch (error) {
    console.error("Error fetching employees:", error);
    await db.close();
    throw error;
  }
};

const insertEmployee = async (name, hash) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(
    "INSERT INTO Employees (name, hash) VALUES (?, ?)"
  );
  await stmt.run(name, hash);
  await stmt.finalize();
  await db.close();
};

const downGrade = async (sessionID) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const query = `UPDATE Sessions SET admin = 0 WHERE sessionID = ?`;
  const result = await db.run(query, sessionID);

  console.log(`Rows updated: ${result.changes}`);
};
const insertSession = async (sessionID, admin, expiresAt) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(
    "INSERT INTO Sessions (sessionID, admin,expiresAt) VALUES (?, ?,?)"
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

  const query = `SELECT expiresAt, admin FROM Sessions WHERE sessionID = ?`;
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
      "DELETE FROM Sessions WHERE sessionID = ?"
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
module.exports = {
  insertSession,
  getPermissionLvl,
  downGrade,
  insertEmployee,
  getEmployees,
};

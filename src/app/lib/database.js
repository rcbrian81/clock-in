const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");

const verifyPassword = async (password) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const employees = await db.all("SELECT id, hash FROM Employees");
    for (const employee of employees) {
      if (await bcrypt.compare(password, employee.hash)) {
        await db.close();
        return { id: employee.id };
      }
    }
    await db.close();
    return null;
  } catch (error) {
    console.error("Error verifying password:", error);
    await db.close();
    throw error;
  }
};

// Check if employee is clocked in
const isEmployeeClockedIn = async (employeeId) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const result = await db.get(
      "SELECT id FROM ClockIn WHERE employeeId = ?",
      employeeId
    );
    await db.close();
    return !!result; // Returns true if an entry exists
  } catch (error) {
    console.error("Error checking clock-in status:", error);
    await db.close();
    throw error;
  }
};

// Add a clock-in record
const clockInEmployee = async (employeeId) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const timeStamp = new Date().toISOString();
    await db.run(
      "INSERT INTO ClockIn (employeeId, timeStamp) VALUES (?, ?)",
      employeeId,
      timeStamp
    );
    await db.close();
  } catch (error) {
    console.error("Error clocking in employee:", error);
    await db.close();
    throw error;
  }
};

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

module.exports = {
  insertSession,
  getPermissionLvl,
  downGrade,
  insertEmployee,
  getEmployees,
  verifyPassword,
  isEmployeeClockedIn,
  clockInEmployee,
};

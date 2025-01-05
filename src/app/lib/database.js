const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const getWorkTimes = async () => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const result = await db.all(
      ` SELECT e.name, w.employeeID, w.clockIn, w.clockOut FROM WorkTimes w LEFT JOIN Employees e ON w.employeeID == e.id ORDER BY w.clockIn ASC;`
    );
    await db.close();
    if (!result) {
      throw new Error("Error In Retriving worktimes.");
    }

    console.log(result);
    return result;
  } catch (error) {
    console.error("database.js: Error quering for worktimes:", error);
    await db.close();
    throw error;
  }
};
const getOnTheClock = async () => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const result = await db.all(
      `SELECT e.name, c.timestamp FROM EMPLOYEES e  INNER JOIN ClockIn c ON e.id == c.employeeId;
    `
    );
    await db.close();
    if (!result) {
      throw new Error("Error In Retriving Hours Worked.");
    }

    console.log(result);
    return result;
  } catch (error) {
    console.error("database.js: Error quering for totalhours:", error);
    await db.close();
    throw error;
  }
};
const getTotalHours = async () => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const result = await db.all(
      `SELECT 
    e.name AS employeeName,
    COALESCE(
        SUM(
            CAST(strftime('%s', w.clockOut) AS REAL) - CAST(strftime('%s', w.clockIn) AS REAL)
        ) / 3600.0, 
        0
    ) AS totalHours
FROM 
    Employees e
LEFT JOIN 
    WorkTimes w ON e.id = w.employeeId
GROUP BY 
    e.id, e.name;


    `
    );
    await db.close();
    if (!result) {
      throw new Error("Error In Retriving Hours Worked.");
    }

    console.log(result);
    return result;
  } catch (error) {
    console.error("database.js: Error quering for totalhours:", error);
    await db.close();
    throw error;
  }
};
const clockOutEmployee = async (employeeId, time_stamp) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    const clockInRecord = await db.get(
      "SELECT timeStamp FROM ClockIn WHERE employeeId = ?",
      employeeId
    );

    if (!clockInRecord) {
      throw new Error("Employee is not currently clocked in.");
    }

    const clockInTime = clockInRecord.timeStamp;
    const clockOutTime = time_stamp;

    await db.run(
      "INSERT INTO WorkTimes (employeeId, clockIn, clockOut) VALUES (?, ?, ?)",
      employeeId,
      clockInTime,
      clockOutTime
    );

    await db.run("DELETE FROM ClockIn WHERE employeeId = ?", employeeId);

    await db.close();
  } catch (error) {
    console.error("Error clocking out employee:", error);
    await db.close();
    throw error;
  }
};
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
    return !!result;
  } catch (error) {
    console.error("Error checking clock-in status:", error);
    await db.close();
    throw error;
  }
};

const clockInEmployee = async (employeeId, time_stamp) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    //const timeStamp = new Date().toISOString();
    await db.run(
      "INSERT INTO ClockIn (employeeId, timeStamp) VALUES (?, ?)",
      employeeId,
      time_stamp
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
    const query = "SELECT name FROM Employees";
    const employees = await db.all(query);
    await db.close();

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    await db.close();
    throw error;
  }
};

const insertEmployee = async (name, password) => {
  const db = await open({
    filename: "./dev.db",
    driver: sqlite3.Database,
  });

  try {
    // Fetch all stored hashes from the database
    const employees = await db.all("SELECT hash FROM Employees");

    // Check if the password matches any existing hash
    for (const employee of employees) {
      const isMatch = await bcrypt.compare(password, employee.hash);
      if (isMatch) {
        throw new Error("Password is already in use by another employee.");
        return "error:match";
      }
    }

    // If no match, hash the new password
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Insert the new employee into the database
    await db.run(
      "INSERT INTO Employees (name, hash) VALUES (?, ?)",
      name,
      hash
    );
    console.log(`Employee ${name} added successfully.`);
    await db.close();
  } catch (error) {
    console.error("Error inserting employee:", error.message);
    await db.close();
    throw error;
  }
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
  clockOutEmployee,
  getTotalHours,
  getOnTheClock,
  getWorkTimes,
};

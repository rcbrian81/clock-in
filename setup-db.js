// setup-db.js

const sqlite3 = require("sqlite3"); // Correctly using 'sqlite3' for the database
const { open } = require("sqlite"); // 'sqlite' is used for asynchronous DB handling with 'sqlite3'

// Function to create the database and tables
const createDatabase = async () => {
  // Open a connection to the SQLite database (creates the db file if it doesn't exist)
  const db = await open({
    filename: "./dev.db", // The SQLite database file that will be created
    driver: sqlite3.Database, // This uses the sqlite3 driver
  });

  // Create the sessionsTable if it doesn't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessionsTable (
      sessionID TEXT PRIMARY KEY,
      admin BOOLEAN,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      expiresAt DATETIME
    )
  `);

  console.log("Database and sessionsTable created!");
  await db.close();
};

// Run the function to create the database and tables
createDatabase().catch((err) => console.error("Error creating database:", err));

import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("vinyls.db");

export const setupDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS vinyls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      year INTEGER,
      isFavorite INTEGER DEFAULT 0
    );
  `);
};

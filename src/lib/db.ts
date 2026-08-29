import Database from "better-sqlite3";
import path from "node:path";

export type Db = InstanceType<typeof Database>;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL REFERENCES sessions(id),
  exercise_id INTEGER NOT NULL REFERENCES exercises(id),
  weight_kg REAL NOT NULL,
  reps INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export const SEED_EXERCISES = [
  "Bench Press",
  "Incline Bench Press",
  "Squat",
  "Deadlift",
  "Romanian Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Pull-Up",
  "Lat Pulldown",
  "Hip Thrust",
  "Bicep Curl",
  "Tricep Pushdown",
];

export function createDb(filePath: string): Db {
  const db = new Database(filePath);
  if (filePath !== ":memory:") {
    db.pragma("journal_mode = WAL");
  }
  db.exec(SCHEMA);

  const insertExercise = db.prepare(
    "INSERT OR IGNORE INTO exercises (name) VALUES (?)"
  );
  const seedTx = db.transaction((names: string[]) => {
    for (const name of names) insertExercise.run(name);
  });
  seedTx(SEED_EXERCISES);

  return db;
}

let singleton: Db | null = null;

export function getDb(): Db {
  if (!singleton) {
    const filePath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "gym.db");
    singleton = createDb(filePath);
  }
  return singleton;
}

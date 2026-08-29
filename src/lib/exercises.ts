import type { Db } from "./db";
import type { Exercise } from "./types";

export function listExercises(db: Db): Exercise[] {
  return db.prepare("SELECT id, name FROM exercises ORDER BY name").all() as Exercise[];
}

export function getOrCreateExercise(db: Db, name: string): Exercise {
  const trimmed = name.trim();
  db.prepare("INSERT OR IGNORE INTO exercises (name) VALUES (?)").run(trimmed);
  return db.prepare("SELECT id, name FROM exercises WHERE name = ?").get(trimmed) as Exercise;
}

import type { Db } from "./db";
import type { SetRow } from "./types";

const SET_COLUMNS = `
  id,
  session_id as sessionId,
  exercise_id as exerciseId,
  weight_kg as weightKg,
  reps,
  created_at as createdAt
`;

export function addSet(
  db: Db,
  params: { sessionId: number; exerciseId: number; weightKg: number; reps: number }
): SetRow {
  const info = db
    .prepare(
      "INSERT INTO sets (session_id, exercise_id, weight_kg, reps) VALUES (?, ?, ?, ?)"
    )
    .run(params.sessionId, params.exerciseId, params.weightKg, params.reps);
  return db
    .prepare(`SELECT ${SET_COLUMNS} FROM sets WHERE id = ?`)
    .get(info.lastInsertRowid) as SetRow;
}

export function listSetsForSession(db: Db, sessionId: number): SetRow[] {
  return db
    .prepare(`SELECT ${SET_COLUMNS} FROM sets WHERE session_id = ? ORDER BY id`)
    .all(sessionId) as SetRow[];
}

export function listSetsForExercise(
  db: Db,
  exerciseId: number
): (SetRow & { date: string })[] {
  return db
    .prepare(
      `
      SELECT s.id, s.session_id as sessionId, s.exercise_id as exerciseId,
             s.weight_kg as weightKg, s.reps, s.created_at as createdAt,
             sess.date as date
      FROM sets s
      JOIN sessions sess ON sess.id = s.session_id
      WHERE s.exercise_id = ?
      ORDER BY sess.date ASC, s.id ASC
      `
    )
    .all(exerciseId) as (SetRow & { date: string })[];
}

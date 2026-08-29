import type { Db } from "./db";

const WEEKLY_TARGET_KEY = "weekly_target";
const DEFAULT_WEEKLY_TARGET = 3;

export function getWeeklyTarget(db: Db): number {
  const row = db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .get(WEEKLY_TARGET_KEY) as { value: string } | undefined;
  return row ? Number(row.value) : DEFAULT_WEEKLY_TARGET;
}

export function setWeeklyTarget(db: Db, target: number): void {
  db.prepare(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`
  ).run(WEEKLY_TARGET_KEY, String(target));
}

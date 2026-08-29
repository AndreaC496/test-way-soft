import type { Db } from "./db";
import type { Session } from "./types";
import { todayISO } from "./dates";

export function getOrCreateSession(db: Db, date: string = todayISO()): Session {
  db.prepare("INSERT OR IGNORE INTO sessions (date) VALUES (?)").run(date);
  return db.prepare("SELECT id, date FROM sessions WHERE date = ?").get(date) as Session;
}

export function getSessionByDate(db: Db, date: string): Session | undefined {
  return db.prepare("SELECT id, date FROM sessions WHERE date = ?").get(date) as
    | Session
    | undefined;
}

export function listSessions(db: Db): Session[] {
  return db.prepare("SELECT id, date FROM sessions ORDER BY date ASC").all() as Session[];
}

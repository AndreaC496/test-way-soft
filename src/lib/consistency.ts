import type { Db } from "./db";
import { listSessions } from "./sessions";
import { getWeeklyTarget } from "./settings";
import { addDays, parseISODate, startOfWeek, toISODate, weekKey } from "./dates";

export interface WeekStat {
  weekStart: string;
  sessionCount: number;
  target: number;
  completionRate: number;
}

/** Every week from the first ever Session through the current week, ascending. */
export function getWeekStats(db: Db, now: Date = new Date()): WeekStat[] {
  const sessions = listSessions(db);
  if (sessions.length === 0) return [];
  const target = getWeeklyTarget(db);

  const counts = new Map<string, number>();
  for (const s of sessions) {
    const wk = weekKey(parseISODate(s.date));
    counts.set(wk, (counts.get(wk) ?? 0) + 1);
  }

  const firstWeek = startOfWeek(parseISODate(sessions[0].date));
  const currentWeek = startOfWeek(now);

  const weeks: WeekStat[] = [];
  for (let wk = firstWeek; wk <= currentWeek; wk = addDays(wk, 7)) {
    const key = toISODate(wk);
    const sessionCount = counts.get(key) ?? 0;
    weeks.push({
      weekStart: key,
      sessionCount,
      target,
      completionRate: target > 0 ? sessionCount / target : 0,
    });
  }
  return weeks;
}

export function getCurrentWeekStat(db: Db, now: Date = new Date()): WeekStat {
  const target = getWeeklyTarget(db);
  const key = toISODate(startOfWeek(now));
  const weeks = getWeekStats(db, now);
  return weeks.find((w) => w.weekStart === key) ?? {
    weekStart: key,
    sessionCount: 0,
    target,
    completionRate: 0,
  };
}

/**
 * Consecutive weeks at >=100% Completion Rate, most recent first.
 * The current (in-progress) week only counts if it has already hit target;
 * otherwise it's skipped rather than treated as a break, since it hasn't failed yet.
 */
export function getStreak(db: Db, now: Date = new Date()): number {
  const weeks = getWeekStats(db, now);
  if (weeks.length === 0) return 0;

  let idx = weeks.length - 1;
  let streak = 0;

  if (weeks[idx].completionRate >= 1) {
    streak++;
  }
  idx--;

  for (; idx >= 0; idx--) {
    if (weeks[idx].completionRate >= 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

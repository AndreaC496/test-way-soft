import { describe, expect, it, beforeEach } from "vitest";
import { createDb, type Db } from "./db";
import { getOrCreateSession } from "./sessions";
import { setWeeklyTarget } from "./settings";
import { getCurrentWeekStat, getStreak, getWeekStats } from "./consistency";

// All weeks below are anchored to Monday 2026-01-05 so week math is unambiguous.
const MON_W1 = "2026-01-05";
const WED_W1 = "2026-01-07";
const FRI_W1 = "2026-01-09";
const MON_W2 = "2026-01-12";
const WED_W2 = "2026-01-14";
const MON_W3 = "2026-01-19";
const now = () => new Date(2026, 0, 19); // Monday of week 3, mid-day-of-week irrelevant

let db: Db;

beforeEach(() => {
  db = createDb(":memory:");
  setWeeklyTarget(db, 2);
});

describe("getWeekStats", () => {
  it("returns one entry per week from the first session through the current week", () => {
    getOrCreateSession(db, MON_W1);
    const weeks = getWeekStats(db, now());
    expect(weeks.map((w) => w.weekStart)).toEqual([MON_W1, MON_W2, MON_W3]);
  });

  it("computes completion rate as sessions logged over the weekly target", () => {
    getOrCreateSession(db, MON_W1);
    getOrCreateSession(db, WED_W1);
    getOrCreateSession(db, FRI_W1);
    const weeks = getWeekStats(db, now());
    const week1 = weeks.find((w) => w.weekStart === MON_W1)!;
    expect(week1.sessionCount).toBe(3);
    expect(week1.completionRate).toBeCloseTo(1.5);
  });

  it("gives weeks with no logged sessions a zero completion rate", () => {
    getOrCreateSession(db, MON_W1);
    const weeks = getWeekStats(db, now());
    const week2 = weeks.find((w) => w.weekStart === MON_W2)!;
    expect(week2.sessionCount).toBe(0);
    expect(week2.completionRate).toBe(0);
  });
});

describe("getCurrentWeekStat", () => {
  it("reflects only the current week's sessions", () => {
    getOrCreateSession(db, MON_W1);
    getOrCreateSession(db, MON_W3);
    const current = getCurrentWeekStat(db, now());
    expect(current.weekStart).toBe(MON_W3);
    expect(current.sessionCount).toBe(1);
  });
});

describe("getStreak", () => {
  it("is zero with no sessions logged", () => {
    expect(getStreak(db, now())).toBe(0);
  });

  it("counts consecutive fully-completed weeks at or above target", () => {
    // Week 1: 2/2 (met), Week 2: 2/2 (met) -> streak of 2 walking back from week 2
    getOrCreateSession(db, MON_W1);
    getOrCreateSession(db, WED_W1);
    getOrCreateSession(db, MON_W2);
    getOrCreateSession(db, WED_W2);
    const streakAtEndOfWeek2 = getStreak(db, new Date(2026, 0, 12));
    expect(streakAtEndOfWeek2).toBe(2);
  });

  it("breaks at the first completed week that fell short", () => {
    getOrCreateSession(db, MON_W1); // week 1: 1/2, short
    getOrCreateSession(db, MON_W2);
    getOrCreateSession(db, WED_W2); // week 2: 2/2, met
    const streak = getStreak(db, new Date(2026, 0, 12));
    expect(streak).toBe(1);
  });

  it("does not let an in-progress current week reset a real streak", () => {
    getOrCreateSession(db, MON_W1);
    getOrCreateSession(db, WED_W1); // week 1: 2/2, met
    getOrCreateSession(db, MON_W2); // current week: 1/2, not yet met, still open
    const streak = getStreak(db, new Date(2026, 0, 12));
    expect(streak).toBe(1);
  });

  it("counts the current week once it has already hit target, even before the week ends", () => {
    getOrCreateSession(db, MON_W1);
    getOrCreateSession(db, WED_W1); // week 1: 2/2, met
    getOrCreateSession(db, MON_W2);
    getOrCreateSession(db, WED_W2); // current week: 2/2, met early
    const streak = getStreak(db, new Date(2026, 0, 12));
    expect(streak).toBe(2);
  });
});

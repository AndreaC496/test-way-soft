import { describe, expect, it, beforeEach } from "vitest";
import { createDb, type Db } from "./db";
import { getOrCreateSession } from "./sessions";
import { getOrCreateExercise } from "./exercises";
import { addSet } from "./sets";
import { estimatedOneRepMax, getExerciseHistory, volumeLoad } from "./performance";

describe("estimatedOneRepMax", () => {
  it("treats a 1-rep set as a measured max, not an Epley estimate", () => {
    expect(estimatedOneRepMax(100, 1)).toBe(100);
  });

  it("applies the Epley formula above 1 rep", () => {
    // 100 * (1 + 5/30) = 116.666...
    expect(estimatedOneRepMax(100, 5)).toBeCloseTo(116.67, 1);
  });
});

describe("volumeLoad", () => {
  it("is weight times reps", () => {
    expect(volumeLoad(80, 5)).toBe(400);
  });
});

describe("getExerciseHistory", () => {
  let db: Db;
  let exerciseId: number;

  beforeEach(() => {
    db = createDb(":memory:");
    exerciseId = getOrCreateExercise(db, "Bench Press").id;
  });

  function logSet(date: string, weightKg: number, reps: number) {
    const session = getOrCreateSession(db, date);
    addSet(db, { sessionId: session.id, exerciseId, weightKg, reps });
  }

  it("flags the first set at a given rep count as a PR", () => {
    logSet("2026-01-01", 80, 5);
    const [entry] = getExerciseHistory(db, exerciseId);
    expect(entry.isPr).toBe(true);
  });

  it("flags a heavier set at the same rep count as a new PR", () => {
    logSet("2026-01-01", 80, 5);
    logSet("2026-01-08", 85, 5);
    const history = getExerciseHistory(db, exerciseId); // most recent first
    expect(history[0].weightKg).toBe(85);
    expect(history[0].isPr).toBe(true);
  });

  it("does not flag a lighter or equal set at the same rep count", () => {
    logSet("2026-01-01", 85, 5);
    logSet("2026-01-08", 80, 5);
    logSet("2026-01-15", 85, 5);
    const history = getExerciseHistory(db, exerciseId);
    expect(history[0].isPr).toBe(false); // 85 again, ties don't exceed
    expect(history[1].isPr).toBe(false); // 80, lighter
    expect(history[2].isPr).toBe(true); // original 85
  });

  it("tracks PRs separately per rep count", () => {
    logSet("2026-01-01", 100, 1);
    logSet("2026-01-08", 80, 5);
    const history = getExerciseHistory(db, exerciseId);
    expect(history.every((h) => h.isPr)).toBe(true);
  });
});

import type { Db } from "./db";
import { listSetsForExercise } from "./sets";

/** Epley formula; a Set performed at 1 rep is a measured max, not an estimate. */
export function estimatedOneRepMax(weightKg: number, reps: number): number {
  if (reps <= 1) return weightKg;
  return weightKg * (1 + reps / 30);
}

export function volumeLoad(weightKg: number, reps: number): number {
  return weightKg * reps;
}

export interface ExerciseHistoryEntry {
  id: number;
  date: string;
  weightKg: number;
  reps: number;
  volumeLoad: number;
  estimatedOneRepMax: number;
  isPr: boolean;
}

/**
 * Chronological history for an Exercise with computed Volume Load, Estimated 1RM,
 * and PR flags. A PR is the heaviest weight yet seen at that exact rep count,
 * evaluated as of that point in history (not with hindsight from later sets).
 */
export function getExerciseHistory(db: Db, exerciseId: number): ExerciseHistoryEntry[] {
  const sets = listSetsForExercise(db, exerciseId);
  const bestByReps = new Map<number, number>();
  const result: ExerciseHistoryEntry[] = [];

  for (const s of sets) {
    const priorBest = bestByReps.get(s.reps) ?? 0;
    const isPr = s.weightKg > priorBest;
    if (isPr) bestByReps.set(s.reps, s.weightKg);

    result.push({
      id: s.id,
      date: s.date,
      weightKg: s.weightKg,
      reps: s.reps,
      volumeLoad: volumeLoad(s.weightKg, s.reps),
      estimatedOneRepMax: estimatedOneRepMax(s.weightKg, s.reps),
      isPr,
    });
  }

  return result.reverse();
}

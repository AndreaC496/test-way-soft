"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getOrCreateSession } from "@/lib/sessions";
import { getOrCreateExercise } from "@/lib/exercises";
import { addSet } from "@/lib/sets";
import { setWeeklyTarget } from "@/lib/settings";
import { todayISO } from "@/lib/dates";

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/consistency");
  revalidatePath("/performance");
}

export async function addSetAction(formData: FormData) {
  const exerciseId = Number(formData.get("exerciseId"));
  const weightKg = Number(formData.get("weightKg"));
  const reps = Number(formData.get("reps"));
  if (!exerciseId || !(weightKg > 0) || !(reps > 0)) return;

  const db = getDb();
  const session = getOrCreateSession(db, todayISO());
  addSet(db, { sessionId: session.id, exerciseId, weightKg, reps });
  revalidateAll();
}

export async function addExerciseAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  const db = getDb();
  getOrCreateExercise(db, name);
  revalidatePath("/");
}

export async function setWeeklyTargetAction(formData: FormData) {
  const target = Number(formData.get("target"));
  if (!(target > 0)) return;

  const db = getDb();
  setWeeklyTarget(db, target);
  revalidatePath("/consistency");
}

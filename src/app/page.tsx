import { getDb } from "@/lib/db";
import { listExercises } from "@/lib/exercises";
import { getSessionByDate } from "@/lib/sessions";
import { listSetsForSession } from "@/lib/sets";
import { todayISO } from "@/lib/dates";
import { addExerciseAction, addSetAction } from "./actions";

export const dynamic = "force-dynamic";

export default function LogPage() {
  const db = getDb();
  const exercises = listExercises(db);
  const today = todayISO();
  const session = getSessionByDate(db, today);
  const sets = session ? listSetsForSession(db, session.id) : [];
  const exerciseName = (id: number) =>
    exercises.find((e) => e.id === id)?.name ?? "Unknown";

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Today — {today}</h1>

      <section className="space-y-4 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Log a set</h2>
        <form action={addSetAction} className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-zinc-500" htmlFor="exerciseId">
              Exercise
            </label>
            <select
              id="exerciseId"
              name="exerciseId"
              required
              className="rounded border px-2 py-1.5"
            >
              {exercises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-zinc-500" htmlFor="weightKg">
              Weight (kg)
            </label>
            <input
              id="weightKg"
              name="weightKg"
              type="number"
              step="0.5"
              min="0"
              required
              className="w-24 rounded border px-2 py-1.5"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-zinc-500" htmlFor="reps">
              Reps
            </label>
            <input
              id="reps"
              name="reps"
              type="number"
              min="1"
              required
              className="w-20 rounded border px-2 py-1.5"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-700"
          >
            Add set
          </button>
        </form>

        <form action={addExerciseAction} className="flex items-end gap-3 border-t pt-4">
          <div className="flex flex-col">
            <label className="text-sm text-zinc-500" htmlFor="name">
              New exercise
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Leg Press"
              className="rounded border px-2 py-1.5"
            />
          </div>
          <button type="submit" className="rounded border px-3 py-1.5 hover:bg-zinc-50">
            Add to catalog
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Today&apos;s sets</h2>
        {sets.length === 0 ? (
          <p className="text-zinc-500">No sets logged yet today.</p>
        ) : (
          <table className="w-full rounded border bg-white text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="px-3 py-2">Exercise</th>
                <th className="px-3 py-2">Weight</th>
                <th className="px-3 py-2">Reps</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="px-3 py-2">{exerciseName(s.exerciseId)}</td>
                  <td className="px-3 py-2">{s.weightKg} kg</td>
                  <td className="px-3 py-2">{s.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

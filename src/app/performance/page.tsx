import { getDb } from "@/lib/db";
import { listExercises } from "@/lib/exercises";
import { getExerciseHistory } from "@/lib/performance";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ exerciseId?: string }>;
};

export default async function PerformancePage({ searchParams }: Props) {
  const db = getDb();
  const exercises = listExercises(db);
  const { exerciseId: exerciseIdParam } = await searchParams;
  const exerciseId = Number(exerciseIdParam) || exercises[0]?.id;
  const history = exerciseId ? getExerciseHistory(db, exerciseId) : [];

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Performance</h1>

      <form method="get" className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-zinc-500" htmlFor="exerciseId">
            Exercise
          </label>
          <select
            id="exerciseId"
            name="exerciseId"
            defaultValue={exerciseId}
            className="rounded border px-2 py-1.5"
          >
            {exercises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded border px-3 py-1.5 hover:bg-zinc-50">
          View
        </button>
      </form>

      {history.length === 0 ? (
        <p className="text-zinc-500">No sets logged for this exercise yet.</p>
      ) : (
        <table className="w-full rounded border bg-white text-sm">
          <thead>
            <tr className="border-b text-left text-zinc-500">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Weight</th>
              <th className="px-3 py-2">Reps</th>
              <th className="px-3 py-2">Volume</th>
              <th className="px-3 py-2">Est. 1RM</th>
              <th className="px-3 py-2">PR</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id} className={`border-t ${h.isPr ? "bg-amber-50" : ""}`}>
                <td className="px-3 py-2">{h.date}</td>
                <td className="px-3 py-2">{h.weightKg} kg</td>
                <td className="px-3 py-2">{h.reps}</td>
                <td className="px-3 py-2">{h.volumeLoad} kg</td>
                <td className="px-3 py-2">{h.estimatedOneRepMax.toFixed(1)} kg</td>
                <td className="px-3 py-2">{h.isPr ? "🏆" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

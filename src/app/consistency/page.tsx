import { getDb } from "@/lib/db";
import { getCurrentWeekStat, getStreak, getWeekStats } from "@/lib/consistency";
import { getWeeklyTarget } from "@/lib/settings";
import { setWeeklyTargetAction } from "../actions";

export const dynamic = "force-dynamic";

export default function ConsistencyPage() {
  const db = getDb();
  const target = getWeeklyTarget(db);
  const current = getCurrentWeekStat(db);
  const streak = getStreak(db);
  const recentWeeks = getWeekStats(db).slice(-8).reverse();

  return (
    <main className="mx-auto max-w-2xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Consistency</h1>

      <section className="flex flex-wrap gap-4">
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-zinc-500">This week</div>
          <div className="text-2xl font-semibold">
            {current.sessionCount} / {current.target}
          </div>
          <div className="text-sm text-zinc-500">
            {Math.round(current.completionRate * 100)}% of target
          </div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-zinc-500">Streak</div>
          <div className="text-2xl font-semibold">
            {streak} {streak === 1 ? "week" : "weeks"}
          </div>
        </div>
      </section>

      <section className="space-y-3 rounded border bg-white p-4">
        <h2 className="text-lg font-medium">Weekly target</h2>
        <form action={setWeeklyTargetAction} className="flex items-end gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-zinc-500" htmlFor="target">
              Sessions per week
            </label>
            <input
              id="target"
              name="target"
              type="number"
              min="1"
              defaultValue={target}
              className="w-24 rounded border px-2 py-1.5"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-700"
          >
            Save
          </button>
        </form>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Recent weeks</h2>
        {recentWeeks.length === 0 ? (
          <p className="text-zinc-500">No sessions logged yet.</p>
        ) : (
          <table className="w-full rounded border bg-white text-sm">
            <thead>
              <tr className="border-b text-left text-zinc-500">
                <th className="px-3 py-2">Week of</th>
                <th className="px-3 py-2">Sessions</th>
                <th className="px-3 py-2">Completion</th>
              </tr>
            </thead>
            <tbody>
              {recentWeeks.map((w) => (
                <tr key={w.weekStart} className="border-t">
                  <td className="px-3 py-2">{w.weekStart}</td>
                  <td className="px-3 py-2">
                    {w.sessionCount} / {w.target}
                  </td>
                  <td className="px-3 py-2">{Math.round(w.completionRate * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

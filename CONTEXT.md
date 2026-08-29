# Gym Tracker

A solo-use app for logging gym training and surfacing two signals from it: whether you're training consistently, and whether you're getting stronger.

## Language

### Training log

**Session**:
A single day's training. At most one Session exists per calendar day; all Sets logged that day belong to it.
_Avoid_: Workout, training day

**Set**:
One logged entry of weight lifted for a given number of reps, for one Exercise, within a Session.
_Avoid_: Rep, lift entry

**Exercise**:
A named movement (e.g. Bench Press, Squat) that Sets are logged against. Comes from a seeded catalog but is user-extensible: logging a Set for an unlisted name adds it to the catalog.
_Avoid_: Movement, lift (as a noun for the exercise itself, to keep "lift" free for the act of lifting)

### Consistency

**Weekly Target**:
The user's configured number of Sessions they intend to complete per week. A single global setting, not per-exercise or per-week.
_Avoid_: Goal, plan

**Completion Rate**:
Logged Sessions in a given week ÷ Weekly Target for that week. Can exceed 100%.
_Avoid_: Adherence rate, compliance

**Streak**:
The count of consecutive weeks where Completion Rate reached at least 100%. Breaks the first week a Session-count falls short of the Weekly Target.
_Avoid_: Day streak — this app's Streak is a weekly concept, not a daily one.

### Performance

**Volume Load**:
Weight × reps for a Set. Sums naturally to any higher level (an Exercise's Volume Load within a Session, a Session's total Volume Load, or a Volume Load over a date range) — it is not a fixed per-entity value.
_Avoid_: Tonnage, work done

**Estimated 1RM**:
A calculated approximation of the maximum weight liftable for one rep on an Exercise, derived from a single Set's weight and reps via a standard estimation formula.
_Avoid_: 1-rep max, true max — it is always an estimate, never a measured value, unless the Set itself was performed at 1 rep.

**Personal Record (PR)**:
The heaviest weight ever logged for an Exercise at a specific rep count (e.g. a 5-rep PR and a 1-rep PR on the same Exercise are tracked separately). A new Set sets a PR when its weight exceeds every prior Set on that Exercise at the same rep count.
_Avoid_: Max, best lift — always qualify with the rep count it was set at.

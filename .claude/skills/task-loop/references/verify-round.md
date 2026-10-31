# Verify -> fix

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT), with the Organized Codebase `/verify` suite as the floor.

First run `/verify` (lint, typecheck, tests, build). It is the floor, not the proof.

If the change has no runnable surface (docs, CI config, types, a pure refactor), say so. There is no
matrix; the `/verify` suite is the whole of verify. Tell the user that is what "verified" means here.
Drift still runs next.

## Build the test matrix first

Take the spec's critical user journeys and build the matrix in `references/test-matrix.md` before
anything boots. Each row names its entry point, the end state, the rows it must write, and its side
effects outside the app. A journey with no entry point is a finding, not a row.

Do not start from the code. Start from what a user does, then check that the code reaches it.

## Drive each row

One fresh driver per row. It runs the spec's reset command to bring a non-production environment to
baseline, fakes only the outside services the row names, and drives the row the way a user would: a
browser for anything with a screen, real requests for an API.

- **Reset before every row.** Sequential rows reseed the shared environment first. Parallel rows
  each get their own sandbox, seeded from the same baseline. No row inherits another row's state.
- **Parallel only when independent.** "Independent" and "shared state" are defined in
  `references/test-matrix.md`. Any shared state means sequential runs.

## Judge the evidence

One fresh reader per verify round reads every row's evidence file (database queries, logs,
screenshots) and gives each row its verdict. The reader drove no row. Route on its verdict, never
on a driver's claim.

**Evidence,** one file per row under `planning/task-loop/<slug>/verify/`: screenshots or a
recording for anything with a screen; the real request, response and a database query for a
backend row, not just a 200. Never capture a real person's data.

## Outcomes

- **Passed.** Done. If a small defect is found along the way, it becomes a new issue, not a silent
  fix.
- **Ran wrong** (an error, wrong output, a 200 with no row). Back to the builder window with
  evidence. After the fix, reset and re-drive that row, and re-run the `/verify` suite. That spends
  a verify round; the cap is principle 5 in `../SKILL.md`.
- **Couldn't boot** (missing credential, environment or database). No fix loop, because no code
  change repairs a credential. Report the row as unverified. Never swap in a weaker check and call
  it verified.
- **Unreachable** (the precondition is a state the app never creates). Report it as unreachable,
  not failed: failed means the code is wrong, unreachable means it never runs. Ask the user whether
  to delete that branch or what reaches it.

## What comes next

Drift runs when verify is settled. The entry gate is defined once, in `../SKILL.md` Step 5. A drift
"code wrong" fix comes back here for the affected rows and spends a verify round.

Every verdict describes one commit. If the code changes after a row passed, that row's evidence is
for an older SHA; re-drive it if the change could reach it.

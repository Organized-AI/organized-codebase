# Verify -> fix

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT), with the Organized Codebase `/verify` suite as the floor.

First run `/verify` (lint, typecheck, tests, build). It is the floor, not the proof.

If the change has no runnable surface (docs, CI config, types, a pure refactor), say so and stop
after `/verify`; tell the user that is what "verified" means here. Skip the matrix and go straight to
the drift check.

## Build the test matrix first

Take the spec's critical user journeys and build the matrix in `references/test-matrix.md` before
anything boots. Each row names its entry point, the end state, the rows it must write, and its side
effects outside the app. A journey with no entry point is a finding, not a row.

Do not start from the code. Start from what a user does, then check that the code reaches it.

## Drive each row

A fresh agent boots the app against a real non-production database, fakes only the outside services
the row names, and drives the row the way a user would: a browser for anything with a screen, real
requests for an API.

- **Reset between rows.** Reseed the database before each row. No row inherits another row's state.
- **Parallel only when independent.** Rows that share no state may run in parallel, each in its own
  sandbox, database, or Redis instance. Any shared state means sequential runs.

After a row is driven, a separate agent that did not drive it reads the database, logs and
screenshots and gives the verdict. Route on that verdict, never on the driver's claim.

**Evidence,** one entry per row under `planning/task-loop/<slug>/verify/`: screenshots or a
recording for anything with a screen; the real request, response and a database query for a
backend row, not just a 200. Never capture a real person's data.

**Outcomes:**

- **Passed.** Done. If a small defect is found along the way, it becomes a new issue, not a silent
  fix.
- **Ran wrong** (an error, wrong output, a 200 with no row). Back to the builder window with
  evidence, then verify again. Two rounds at most.
- **Couldn't boot** (missing credential, environment or database). No fix loop, because no code
  change repairs a credential. Report the row as unverified. Never swap in a weaker check and call
  it verified.
- **Unreachable** (the precondition is a state the app never creates). Report it as unreachable,
  not failed: failed means the code is wrong, unreachable means it never runs. Ask the user whether
  to delete that branch or what reaches it.

When every row has a verdict, the drift check runs next (`references/drift-check.md`).

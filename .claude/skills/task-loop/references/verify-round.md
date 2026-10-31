# Verify -> fix

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT), with the Organized Codebase `/verify` suite as the floor.

A verify round is one `/verify` suite run plus one drive-and-judge pass over the rows being driven.
Verify gets two rounds, the first included (principle 5 in `../SKILL.md`).

First run `/verify` (lint, typecheck, tests, build). It is the floor, not the proof. A failing suite
fails the round.

If the change has no runnable surface (`../SKILL.md` Step 0 defines it), say so. There is no
matrix; the `/verify` suite is the whole of verify. Tell the user that is what "verified" means
here. Drift still runs next.

## Build the test matrix first

Take the spec's critical user journeys and write the matrix to `planning/task-loop/<slug>/matrix.md`
in the format in `test-matrix.md`, before anything boots. Each row names its entry point, the paths
it exercises, the end state, the records it must write, and its side effects outside the app. A
journey with no entry point is a finding, not a row.

Do not start from the code. Start from what a user does, then check that the code reaches it.

## Drive the rows

One fresh driver per round. It gets `matrix.md` and the spec's reset command, nothing else. For
each row, in order:

1. **Confirm the target is non-production.** Match it against the environment name or URL the spec
   marks as non-production, and write the target into the evidence file. If it cannot confirm, it
   does not reset: the row is "couldn't boot".
2. **Reset.** Run the reset command.
3. **Drive** the row the way a user would: a browser for anything with a screen, real requests for
   an API. Fake only the outside services the row names.
4. **Capture raw output** into the row's evidence file before the next reset wipes it: the exact
   requests and responses, the database query and its full result, screenshot paths. The driver
   writes no verdict.

Rows that share no state (defined in `test-matrix.md`) may run in parallel, one driver per sandbox,
each sandbox created with the spec's sandbox command. Any shared state means one driver, in order.

## Judge the evidence

One fresh reader per round reads every evidence file and writes each row's verdict into the file and
into `matrix.md`. The reader drove no row. It judges raw output only; a driver's summary or opinion
is a claim and the reader ignores it. Route on the reader's verdict.

## Outcomes

- **Passed.** Done. If a small defect is found along the way, it becomes a new issue, not a silent
  fix.
- **Ran wrong** (an error, wrong output, a 200 with no record), or a failing `/verify` suite. Back
  to the builder window with the evidence. If a round remains, the next round re-drives the affected
  rows and re-runs the suite. If none remains, the report carries it as unresolved.
- **Couldn't boot** (missing credential, environment or database, or a target that could not be
  confirmed as non-production). No fix loop, because no code change repairs a credential. Report
  the row as unverified. Never swap in a weaker check and call it verified.
- **Unreachable** (the precondition is a state the app never creates). Report it as unreachable,
  not failed: failed means the code is wrong, unreachable means it never runs. Ask the user whether
  to delete that branch or what reaches it.

## What comes next

Drift runs when verify is settled; the entry gate is defined once, in `../SKILL.md` Step 5. Whether
a verdict still counts after later commits is decided by the carry rule in the same step.

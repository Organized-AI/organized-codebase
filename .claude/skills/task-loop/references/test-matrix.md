# Test matrix: one row per user journey

Used by Step 4 (verify) in SKILL.md. Build the matrix before anything boots. Its rows come from the
spec's critical user journeys, so the matrix tests what a user can do, not what the code contains.

## Build the matrix

For each changed behavior, list the journeys a user takes through it. Consider the standard set
(create, read, edit, search, share, delete) and the failure paths (bad input, missing permission,
expired session). Drop what the change cannot touch; name what it can.

| # | Journey | Entry point | End state | Rows written | Side effects | Independent? | Verdict |
|---|---------|-------------|-----------|--------------|--------------|--------------|---------|

## Rules

- **Entry point is required.** Each row names the route, click path, or API call that starts it. A
  journey with no path in is a finding, not a row. This is the same rule review applies.
- **State what the row must leave behind.** The rows written and the outside side effects (email,
  webhook, queued job) are what verification reads. A 200 with no row is a failure.
- **Reset before, not after.** Reseed the non-production database before each row. A row that relies
  on another row's leftovers is not independent and is not verified.
- **Independent means no shared state.** Rows that share no rows and need no other row's output may
  run in parallel, each in its own sandbox or database. Otherwise run them in sequence.
- **Unreachable is not failed.** If a row's precondition is a state the app never creates, mark it
  unreachable and ask the user (see verify-round.md). Do not write it off as passing.

## Evidence

One file per row: `planning/task-loop/<slug>/verify/<row-number>-<journey>.md`. It holds the entry
point used, the real request and response (or a screenshot or recording for anything with a screen),
the database query that proves the rows, and the verdict. The verdict comes from a reader that did
not drive the row.

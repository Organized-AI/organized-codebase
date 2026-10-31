# Test matrix: one row per user journey

Used by Step 4 (verify) in SKILL.md. Build the matrix before anything boots. Its rows come from the
spec's critical user journeys, so the matrix tests what a user can do, not what the code contains.

## Build the matrix

For each changed behavior, list the journeys a user takes through it. Consider the standard set
(create, read, edit, search, share, delete) and the failure paths (bad input, missing permission,
expired session). Drop what the change cannot touch; name what it can.

| # | Journey | Entry point | End state | Rows written | Side effects | Independent? | Verdict |
|---|---------|-------------|-----------|--------------|--------------|--------------|---------|

## Shared state

Two rows share state when they touch any of the same:

- database, schema, or table they write and the other reads
- user, auth account, session, or API key
- fake outside service instance (mail catcher, webhook sink, payment stub)
- queue, cache (Redis), or file storage bucket
- output of the other row (an ID, a token, a record it creates)

Rows that share none of these are **independent**.

## Rules

- **Entry point is required.** Each row names the route, click path, or API call that starts it. A
  journey with no path in is a finding, not a row. The goldfish reviewer checks the spec's journeys
  for the same thing (lens 4 in `.claude/agents/goldfish-reviewer.md`).
- **State what the row must leave behind.** The rows written and the outside side effects (email,
  webhook, queued job) are what verification reads. A 200 with no row is a failure.
- **Reset before, not after.** The driver runs the spec's reset command before the row starts. A row
  that relies on another row's leftovers is not independent and is not verified.
- **Parallel rows get their own sandbox.** Independent rows may run in parallel, each in its own
  sandbox with its own copy of every item in the shared-state list, seeded from the same baseline.
  If a shared item cannot be duplicated (one real auth tenant, one external sandbox account), the
  rows that use it run in sequence with a reset between them.
- **Unreachable is not failed.** If a row's precondition is a state the app never creates, mark it
  unreachable and ask the user (see verify-round.md). Do not write it off as passing.

## Evidence

One file per row: `planning/task-loop/<slug>/verify/<row-number>-<journey-slug>.md`, where the
journey slug is lowercase ASCII with hyphens for anything else (`03-share-doc-with-viewer.md`). It
holds the head SHA driven, the entry point used, the real request and response (or a screenshot or
recording for anything with a screen), the database query that proves the rows, and the verdict.
The verdict comes from the round's reader, which did not drive the row.

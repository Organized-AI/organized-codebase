# Test matrix: one row per user journey

Used by Step 4 (verify) in SKILL.md. Build the matrix before anything boots. Its rows come from the
spec's critical user journeys, so the matrix tests what a user can do, not what the code contains.

In this file, a **row** is a matrix row. Data the app writes is a **record**.

## Build the matrix

For each changed behavior, list the journeys a user takes through it. Consider the standard set
(create, read, edit, search, share, delete) and the failure paths (bad input, missing permission,
expired session). Drop what the change cannot touch; name what it can.

The matrix lives at `planning/task-loop/<slug>/matrix.md`, so a resumed window finds it and every
verdict in it.

| # | Journey | Entry point | Paths exercised | End state | Records written | Side effects | Independent? | Evidence SHA | Verdict |
|---|---------|-------------|-----------------|-----------|-----------------|--------------|--------------|--------------|---------|

**Paths exercised** lists the files and directories on the row's path: the code it runs, its config,
its fixtures. The carry rule in `../SKILL.md` Step 5 compares this list with later commits to decide
whether the row's verdict still counts.

## Shared state

Two rows share state when they touch any of the same:

- database, schema, or table that one writes and the other reads
- user, auth account, session, or API key
- fake outside service instance (mail catcher, webhook sink, payment stub)
- queue, cache (Redis), or file storage bucket
- output of the other row (an ID, a token, a record it creates)

Rows that share none of these are **independent**.

## Rules

- **Entry point is required.** Each row names the route, click path, or API call that starts it. A
  journey with no path in is a finding, not a row. The goldfish reviewer checks the spec's journeys
  for the same thing (lens 4 in `.claude/agents/goldfish-reviewer.md`).
- **State what the row must leave behind.** The records written and the outside side effects
  (email, webhook, queued job) are what the reader checks. A 200 with no record is a failure.
- **Reset before, never after, and only non-production.** The driver confirms the target against
  the environment the spec marks as non-production, then runs the reset command. A row that relies
  on another row's leftovers is not independent and is not verified.
- **Parallel rows get their own sandbox.** Independent rows may run in parallel, each in a sandbox
  made with the spec's sandbox command and seeded from the same baseline. If a shared item cannot be
  duplicated (one real auth tenant, one external sandbox account), the rows that use it run in
  order with a reset between them.
- **Unreachable is not failed.** If a row's precondition is a state the app never creates, mark it
  unreachable and ask the user (see `verify-round.md`). Do not write it off as passing.

## Evidence

One file per row: `planning/task-loop/<slug>/verify/<row-number>-<journey-slug>.md`, where the
journey slug is lowercase ASCII with hyphens for anything else (`03-share-doc-with-viewer.md`).
Two sections, each written by one agent:

```
## Driven            (driver writes; raw output only, no verdict)
SHA: <head SHA driven>
Target: <environment, confirmed non-production>
Entry point: <route, click path, or API call>
Output: <exact requests and responses, or screenshot paths>
Records: <the query and its full result>

## Verdict           (reader writes; the driver never edits this section)
<Passed | Ran wrong | Couldn't boot | Unreachable>, with the line of raw output it rests on
```

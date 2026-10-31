# Verify -> fix

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT), with the Organized Codebase `/verify` suite as the floor.

First run `/verify` (lint, typecheck, tests, build). It is the floor, not the proof.

List the flows the change touches. If it has no runnable surface (docs, CI config, types, a pure
refactor), say so and stop after `/verify`; tell the user that is what "verified" means here.

Write each flow's brief before anything boots: the end state the user reaches, the rows the app
must write, and the side effects outside the app (email, webhook, queued job).

A fresh agent then boots the app against a real non-production database, fakes only the outside
services the brief names, and drives the flow the way a user would: a browser for anything with a
screen, real requests for an API.

After a flow is driven, a separate agent that did not drive the flow reads the database, logs and
screenshots and gives the verdict. Route on that verdict, never on the driver's claim.

**Evidence,** one entry per flow under `planning/task-loop/<slug>/verify/`: screenshots or a
recording for anything with a screen; the real request, response and a database query for a
backend flow, not just a 200. Never capture a real person's data.

**Outcomes:**

- **Passed.** Done. If a small defect is found along the way, it becomes a new issue, not a silent
  fix.
- **Ran wrong** (an error, wrong output, a 200 with no row). Back to the builder window with
  evidence, then verify again. Two rounds at most.
- **Couldn't boot** (missing credential, environment or database). No fix loop, because no code
  change repairs a credential. Report the flow as unverified. Never swap in a weaker check and call
  it verified.
- **Unreachable** (the precondition is a state the app never creates). Report it as unreachable,
  not failed: failed means the code is wrong, unreachable means it never runs. Ask the user whether
  to delete that branch or what reaches it.

# Implementation notes

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT).

There is no perfect spec. A spec can never cover everything. The builder meets the gaps between
the spec and the codebase.

To avoid surprising the user, write `planning/specs/<slug>.notes.md` as you build:

- **Design decisions:** where the spec was ambiguous, and the reading picked.
- **Deviations:** where the build departed from the spec on purpose, and why.
- **Tradeoffs:** alternatives considered, and why this one won.
- **Open questions:** anything the user should confirm, phrased as a question.

The notes go in the PR body and are refreshed after each fix round.

The open questions go to the user in the final report, each with a recommended answer.

This file is also what makes the one-window constraint survivable: when the builder window
compacts or a session resumes, the notes plus the spec rebuild the state without the transcript.

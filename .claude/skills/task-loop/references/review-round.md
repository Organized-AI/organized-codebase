# Review -> fix

Adapted from Ray Amjad's [task-lifecycle](https://github.com/ray-amjad/skills/tree/main/skills/task-lifecycle)
(MIT), retargeted from orchestrator fan-out to task-loop's one-builder-window shape.

Review `git diff origin/$BASE...HEAD`, where `BASE` is the PR's own base branch, not `main` (on a
stacked PR, `main` pulls the branch below into scope).

Dispatch the **goldfish-reviewer** agent fresh, with the spec path and the base branch only. Where
the harness offers built-in independent reviewers, start them too: Claude Code's `/code-review`
and Codex's `codex review`. If one is unavailable, say so and carry on with the rest; never drop
one silently.

- **Fix** what a reviewer marks confirmed or must-fix (P1): send it to the builder window.
- **Carry** the maybes (plausible, P2) to the final report. Don't send the builder after a maybe.
- **A finding that asks for new code must name the path into that state** (a click, a route, an
  API call). Without one it is carried, not fixed; otherwise the builder writes a branch no user
  enters and verify can never reach it.
- **When reviewers contradict,** don't pick a side. Tell the builder both and let it decide; it
  has the relevant context.
- **Findings with one root cause get one design,** not N patches.
- **The defect is proven; the suggested fix is a guess.** Reviewers are known for being less good
  at prescribing fixes. The builder may fix it another way.

The builder commits and pushes after each group of fixes. Post the findings to the PR so a resumed
run can see them, and keep a copy at `planning/task-loop/<slug>/review-round-N.md`.

The review cap is principle 5 in `../SKILL.md` (two fix rounds, a delta review included); stop
early when every reviewer comes back clean.

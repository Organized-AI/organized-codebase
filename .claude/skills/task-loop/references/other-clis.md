# Task loop outside Claude Code

Organized Codebase's enforcement is Claude-shaped: it lives in `.claude/` and its hooks fire in
Claude Code, including headless runs. Other harnesses get the same loop through different
plumbing. The rules stay identical; only the carrier changes.

| Harness | Rules carrier | Reviewer | Gates |
|---------|---------------|----------|-------|
| Claude Code | This skill + `.claude/` | goldfish-reviewer agent, `/code-review` | settings.json hooks fire, headless included |
| Codex CLI | Section rendered into `AGENTS.md` | `codex review` on the PR | Hooks do not fire headless; enforcement must sit outside the agent (CI or an external runner) |
| OpenCode | Same `AGENTS.md` render | Harness reviewer or a fresh `goldfish-reviewer` read | Run in a container or worktree; external gate |
| Pi Agent | Same `AGENTS.md` render | Fresh review agent over RPC/json | External gate; the json event stream gives the cleanest evidence trail |

## Rendering the rules into AGENTS.md

Copy the Core principles table and the Rules list from `../SKILL.md` into the project's
`AGENTS.md`, plus this loop summary:

```
For any non-trivial change: write planning/specs/<slug>.md first (goal, non-goals, design,
critical user journeys with entry points and a reset command, acceptance checks); large or
risky changes wait for a design approval line in the notes file. Build on a branch, committing
as you go. Review is a fresh context that receives only the spec and the diff. Verify with the
project's checks, then, for runnable surfaces, a fresh driver drives every journey row in
matrix.md, resetting a confirmed non-production environment before each, and a separate reader
judges the raw output. Then run a drift check: every documented claim in the change's scope
against the code, file:line per check; stale docs are fixed in the PR, code mismatches go back
through fix and verify. Commits after the last review get a delta review if a round remains.
Review and verify each run at most two rounds, the first included; past that, report and stop.
Report each row's evidence SHA and stop before merge; merging is the human's call. Keep spec,
notes, review findings, matrix.md, verify evidence, and drift.md in the repo so any fresh
session reloads state from files.
```

## Why the gate moves outside the agent

In Claude Code, hooks and stop conditions can block a completion claim from inside the session.
Where hooks do not fire (Codex headless today), an agent-side rule is a suggestion. If the loop
must be enforced, enforce it where the agent cannot waive it: CI checks, required PR review, or an
external runner that collects the evidence packet and gates on it.

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
For any non-trivial change: write planning/specs/<slug>.md first, then build on a branch,
committing as you go. Review is a fresh context that receives only the spec and the diff.
Verify with the project's checks plus real flows for runnable surfaces. Stop before merge;
merging is the human's call. Keep spec, notes, review findings, and verify evidence in the repo
so any fresh session reloads state from files.
```

## Why the gate moves outside the agent

In Claude Code, hooks and stop conditions can block a completion claim from inside the session.
Where hooks do not fire (Codex headless today), an agent-side rule is a suggestion. If the loop
must be enforced, enforce it where the agent cannot waive it: CI checks, required PR review, or an
external runner that collects the evidence packet and gates on it.

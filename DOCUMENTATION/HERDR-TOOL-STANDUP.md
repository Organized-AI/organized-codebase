# Herdr Tool Stand-Up Standard

This document defines the **standard post-bootstrap process** for standing up tools, plugins, and agent capabilities after an Organized Codebase project is already running inside **Herdr**.

Use this when the repo has already been bootstrapped and you now need a repeatable way to make an interactive agent session actually useful.

## What this standard solves

Separate three different moments that often get conflated:

1. **Repo bootstrap** — creating or applying Organized Codebase structure
2. **Session bootstrap** — creating a Herdr session/workspace/tab/pane and starting an agent
3. **Tool stand-up** — loading the commands, plugins, toolsets, MCPs, and helper surfaces the current project actually needs

The mistake is trying to do all three at once.

## Core rule

**Bootstrap the repo first, bootstrap the session second, stand up tools third.**

Do not front-load every plugin or tool “just in case.”

## Standard phases

### Phase 0 — Repo bootstrap already complete

At this point the repo should already have the Organized Codebase baseline it needs, such as:

- `.claude/`
- `PLANNING/`
- `AGENT-HANDOFF/`
- optional `.codex/`
- optional `CONFIG/router/`
- optional `harnesses/pi-agent/`

### Phase 1 — Create the Herdr session surface

Use deterministic naming:

- session: `<repo>-<branch-or-worktree>`
- workspace: `<repo>`
- tab: `<agent>-<task-class>`

Example:

```bash
herdr --session organized-codebase-feat-codex-router
```

Then create or reuse the workspace/tab/pane shape needed for the current work.

### Phase 2 — Start the target agent in Herdr

Choose the agent based on the Router decision and the work type.

Examples:

```bash
herdr --session organized-codebase-feat-codex-router \
  agent start hermes --kind hermes --pane <PANE_ID>
```

```bash
herdr --session organized-codebase-feat-codex-router \
  agent start codex --kind codex --pane <PANE_ID>
```

For Claude Code, use the equivalent Claude start path in the target pane.

### Phase 3 — Stand up the agent-specific tool surface

This is where the standard matters.

Stand up the **minimum useful bundle** for the agent in that pane.

## Agent-specific standing-up rules

### A. Claude Code in Herdr

Claude Code is the natural home for **Organized AI Plugin Marketplace** plugins.

#### Standard baseline

Add the marketplace:

```text
/plugin marketplace add Organized-AI/plugin-marketplace
```

Install the baseline Organized Codebase plugins:

```text
/plugin install boris@organized-ai-marketplace
/plugin install phased-planning@organized-ai-marketplace
```

#### Optional plugins by work type

Install only when needed:

```text
/plugin install organized-codebase-applicator@organized-ai-marketplace
/plugin install long-runner@organized-ai-marketplace
/plugin install git-worktree-master@organized-ai-marketplace
```

#### Recommended Claude bundles

**core-oc-claude**
- `boris`
- `phased-planning`

**parallel-oc-claude**
- `boris`
- `phased-planning`
- `long-runner`
- `git-worktree-master`

**migration-oc-claude**
- `boris`
- `phased-planning`
- `organized-codebase-applicator`

#### Verify Claude stand-up

Confirm:

- the marketplace is present
- required plugins are installed
- commands such as `/verify` or planning commands are available
- the session can run the expected workflow without additional manual setup

### B. Hermes in Herdr

Hermes does **not** use the Claude plugin marketplace flow.

For Hermes, standardize on:

1. required toolsets
2. Hermes-native plugins only when they add genuinely missing capability
3. MCP connections only when the project actually needs them
4. skill taps / skills only when the repo or workflow requires them

#### Standard Hermes baseline checks

```bash
hermes tools list
hermes plugins list --enabled --user
hermes mcp list
hermes status
```

#### Recommended Hermes toolset baseline

Enable these when they are not already available in the active profile:

```bash
hermes tools enable terminal
hermes tools enable file
hermes tools enable skills
hermes tools enable session_search
hermes tools enable delegation
```

Add these when the project benefits from them:

```bash
hermes tools enable web
hermes tools enable browser
hermes tools enable vision
hermes tools enable cronjob
hermes tools enable memory
```

> Tool enablement changes take effect on a fresh session. If you change toolsets, restart or open a new Hermes session in Herdr rather than assuming the current one updated in place.

#### Hermes plugin rule

Prefer core Hermes toolsets first.

Only install a Hermes plugin when:

- the capability is missing from built-in tools
- the plugin is project-relevant
- the plugin is likely to be reused across sessions

Install a Hermes plugin with the CLI, not an ad hoc manual copy:

```bash
hermes plugins install owner/repo --enable
```

#### Recommended Hermes bundles

**core-oc-hermes**
- toolsets: `terminal`, `file`, `skills`, `session_search`, `delegation`

**research-oc-hermes**
- `core-oc-hermes`
- plus `web`, `browser`, `vision`

**ops-oc-hermes**
- `core-oc-hermes`
- plus `cronjob`, `memory`

### C. Codex in Herdr

Codex should rely primarily on the project-local adapter surface:

- `AGENTS.md`
- `.codex/config.toml`
- `.codex/agents/*.toml`

Codex standing-up is usually lighter than Claude or Hermes.

#### Standard Codex checks

Confirm:

- `.codex/config.toml` exists
- relevant role cards exist
- `AGENTS.md` is present when using Codex in a repo that expects it
- the pane is launched in the correct repo/worktree

## Minimal standing-up order by agent

### Claude Code

1. Start Claude pane in Herdr
2. Add plugin marketplace
3. Install `boris`
4. Install `phased-planning`
5. Add optional plugins only if the current project needs them
6. Verify command availability

### Hermes

1. Start Hermes pane in Herdr
2. Check toolsets
3. Enable missing toolsets
4. Check plugins / MCPs / status
5. Restart Hermes session if toolset changes were made
6. Verify the target workflow

### Codex

1. Start Codex pane in Herdr
2. Confirm `.codex/` and `AGENTS.md`
3. Use role cards as needed
4. Verify the pane is attached to the right repo/worktree

## Record what got stood up

When a tool bundle is non-trivial, write it down.

Recommended place:

- `AGENT-HANDOFF/` for session-specific notes
- `DOCUMENTATION/` or `CONFIG/` for project-standard bundles

Record:

- which agent was used
- which marketplace/plugins/toolsets were enabled
- which pieces are mandatory vs optional
- what verification proved the stand-up worked

## Anti-bloat rules

To keep this lean:

- do not install every marketplace plugin by default
- do not install Hermes plugins when core toolsets already solve the need
- do not make Claude plugin marketplace rules global for Hermes or Codex
- do not turn post-bootstrap setup into a universal control plane
- do not hide required setup in tribal memory — either document it or automate it cleanly

## Recommended default

For most Organized Codebase projects in Herdr:

- **Claude Code** gets the Organized AI Plugin Marketplace baseline
  - `boris`
  - `phased-planning`
- **Hermes** gets the core Hermes toolset baseline
  - `terminal`
  - `file`
  - `skills`
  - `session_search`
  - `delegation`
- **Codex** gets the thin repo-local `.codex/` surface

Everything beyond that should be task-driven.

## Final rule

**Herdr owns the session. The agent owns its own standing-up path. Organized Codebase owns the standard.**

# Cross-Harness Execution Standard

This document defines the **standard execution model** for Organized Codebase when a project wants to work cleanly across **Claude, Codex, Hermes, Organized Router, and Pi/local companion harnesses** without absorbing ECC-sized control-plane bloat.

## Purpose

Keep the core scaffold small while making interactive multi-agent work predictable.

The separation of concerns is:

- **Organized Codebase core** — repo structure, Boris workflow, verification-first defaults
- **Adapter surfaces** — `.claude/`, `.codex/`, `AGENTS.md`
- **Organized Router** — policy that decides *how* work should run
- **Herdr** — persistent interactive session substrate for coding-agent CLIs
- **Pi/local companion harnesses** — opt-in, task-bounded, frontier-paired local workers

## Non-goals

This standard does **not** turn Organized Codebase into:

- a universal agent operating system
- a giant sync/install/doctor control plane
- a repo full of route-specific prompt ballast
- a default-on local model maze

If a feature only helps one specialized route, it should stay local to that route.

## Core principle

Use the **smallest execution surface that can reliably finish the job**.

That means:

- deterministic shell/tool work should stay deterministic
- persistent coding agents should run in a persistent session substrate
- local companion harnesses should stay bounded and specialized
- escalation to stronger frontier agents should be explicit

## Standard layers

For the standardized post-bootstrap flow that stands up plugins, toolsets, and agent capabilities **after** a Herdr session already exists, see:

- `DOCUMENTATION/HERDR-TOOL-STANDUP.md`

### 1. Core scaffold

The global defaults remain:

- `CLAUDE.md` as the canonical project manual
- Boris-style plan → build → verify → review workflow
- `PLANNING/` for repo-native planning artifacts
- `AGENT-HANDOFF/` for state transfer

### 2. Harness adapter surfaces

Harness-specific instructions stay in their own surfaces:

- `.claude/` for Claude Code commands, agents, permissions
- `.codex/` for Codex config and role cards
- `AGENTS.md` for a short Codex/Hermes-friendly operator brief

These are **adapter surfaces**, not the whole architecture.

### 3. Organized Router

Router decides:

- whether work should run as one-shot deterministic execution
- whether work needs a persistent interactive agent session
- whether work fits a local Pi companion harness first
- when escalation to a stronger frontier route is required

Router does **not** own:

- Herdr pane management details
- Codex/Claude role card prose
- Pi verifier internals
- project business logic unrelated to routing

### 4. Herdr

Herdr is the **default session substrate for interactive coding-agent CLIs**.

Use Herdr for:

- Hermes interactive sessions
- Codex CLI sessions
- Claude Code sessions
- OpenCode or similar interactive coding agents
- resumable workspaces / tabs / panes
- session attach, reuse, wait, readback, and cleanup

Herdr is **not** the replacement for every shell command.

### 5. Pi/local companion harnesses

Pi/local companion harnesses are:

- opt-in
- local-first
- task-bounded
- frontier-paired
- verifiable
- non-global by default

Their job is to mimic a frontier model's **operating shape** for narrow tasks, not to pretend the local model is globally frontier-equivalent.

## Canonical execution modes

Organized Router should route into exactly three execution modes:

- `one_shot`
- `interactive_session`
- `local_companion`

Do not add more modes unless a new mode clearly unlocks unique capability rather than naming a sub-variant.

### `one_shot`

Use for deterministic execution:

- shell commands
- tests
- builds
- linting
- formatting
- git inspection
- scripted verification
- single-turn research transforms that do not need session persistence

Preferred runtime:

- Hermes `terminal`
- Hermes built-in tools
- direct deterministic scripts

### `interactive_session`

Use for multi-turn coding and reasoning where persistence matters:

- code generation with iterative refinement
- design-to-implementation loops
- repo exploration with follow-up prompts
- review sessions
- extended debugging conversations
- long-running coding work that benefits from attach/resume

Preferred runtime:

- agent launched into a **Herdr-managed pane**

### `local_companion`

Use for bounded local tasks where a frontier-paired local model can win on:

- privacy
- cost
- latency
- repeated narrow transforms
- pre-processing or triage before escalation

Typical uses:

- summarization
- classification
- extraction
- context compression
- initial scaffold generation
- bounded verifier or reducer loops

## Default routing matrix

These are the recommended defaults.

| Task class | Default mode | Preferred route |
|---|---|---|
| `summarize` | `local_companion` | local paired harness first |
| `classify` | `local_companion` | local paired harness first |
| `extract` | `local_companion` | local paired harness first |
| `plan` | `interactive_session` | Hermes / Claude / Codex via Herdr |
| `codegen` | `interactive_session` | Codex or Claude via Herdr |
| `review` | `interactive_session` | Codex / Claude review pane |
| `research` | `interactive_session` | persistent research agent unless tightly bounded |
| `verify` | `one_shot` | deterministic tools first, model second |
| `artifact-polish` | `interactive_session` | interactive agent with verification loop |

If `verify` can be answered by tools, do **not** escalate to a model first.

## Router decision inputs

Router decisions should be grounded in:

- task class
- privacy boundary
- risk level
- verification burden
- cost ceiling
- latency tolerance
- availability of a suitable local harness
- need for persistence / multi-turn interaction
- side-effect level

Router decisions should **not** be based on vague prompt preference or arbitrary agent branding.

## Naming conventions

Keep naming deterministic and boring.

### Herdr session name

`<repo>-<branch-or-worktree>`

Examples:

- `organized-codebase-main`
- `organized-codebase-feat-codex-router`
- `payments-service-refactor-auth`

### Herdr workspace name

`<repo>`

Examples:

- `organized-codebase`
- `payments-service`

### Herdr tab label

`<agent>-<task-class>`

Examples:

- `codex-codegen`
- `claude-review`
- `hermes-orchestration`
- `codex-debug`

### Pi companion harness name

`<frontier-pair>-<task-class>-<local-model>`

Examples:

- `claude-review-gemma`
- `gpt5mini-summarize-qwen3`
- `codex-extract-llama`

## Standard launch sequence

### Interactive session path

1. Detect repo + worktree context.
2. Create or reuse a Herdr session.
3. Create or reuse a workspace.
4. Create or reuse a tab for the target agent/task class.
5. Start the target agent in the pane.
6. Submit prompts via Herdr.
7. Wait for idle / done.
8. Read back terminal output.
9. Verify results with deterministic tools.
10. Preserve handoff metadata if the task spans sessions.

### One-shot path

1. Detect verification or deterministic task shape.
2. Run shell/tools directly.
3. Capture output.
4. Stop if tooling already answers the question.
5. Escalate to interactive session only if required.

### Local companion path

1. Choose a frontier-paired local harness.
2. Pass a bounded task packet.
3. Enforce read-only default unless explicitly allowed.
4. Require structured output.
5. Escalate only when confidence, legality, or scope thresholds fail.

## Minimal launcher commands

These are the runtime patterns this standard assumes.

### Start or attach to a Herdr session

```bash
herdr --session organized-codebase-feat-codex-router
```

### Create a tab for an interactive agent

```bash
herdr --session organized-codebase-feat-codex-router \
  tab create \
  --cwd /path/to/repo \
  --label codex-codegen \
  --focus
```

### Start Hermes in an existing pane

```bash
herdr --session organized-codebase-feat-codex-router \
  agent start hermes --kind hermes --pane <PANE_ID>
```

### Start Codex in an existing pane

```bash
herdr --session organized-codebase-feat-codex-router \
  agent start codex --kind codex --pane <PANE_ID>
```

### Submit a prompt and wait for completion

```bash
herdr --session organized-codebase-feat-codex-router \
  agent prompt hermes "Inspect the diff and propose the smallest safe fix." \
  --wait --until idle --timeout 120000
```

### Read the last output

```bash
herdr --session organized-codebase-feat-codex-router \
  agent read hermes --lines 120 --format text
```

### Stop a completed session

```bash
herdr session stop organized-codebase-feat-codex-router
```

## Pi companion contract

Every Pi/local companion harness should preserve these constraints:

- JSON input/output contract
- explicit task packet shape
- explicit verifier posture
- read-only by default
- bounded stage/token/time budgets
- explicit legality / safety gate
- trace and score output
- explicit escalation reason when handing work to a frontier agent

A Pi harness should mimic a frontier model's:

- task decomposition
- output contract
- verifier threshold
- refusal boundary
- escalation policy

It should **not** mimic frontier prose style for its own sake.

## Promotion rules

Promote a behavior from local route to shared core only if it wins repeatedly across:

- Claude routes
- Codex routes
- Hermes routes
- Pi/local routes

If a rule only helps one local harness family, keep it local.

## Anti-bloat rules

To stay leaner than ECC:

- do not create a giant universal command/control surface
- do not make Herdr mandatory for one-shot verification work
- do not move Pi-specific routing rules into global defaults
- do not duplicate `CLAUDE.md` into every harness adapter
- do not treat adapter surfaces as architecture centers
- do not add repair/doctor/sync machinery unless repeated failures justify it
- do not invent a new execution mode when a route policy or preset would do

## Verification standard

Every route should end in deterministic verification where possible.

Minimum expectations:

- `codegen` → diff inspection + test/build/lint if available
- `review` → explicit findings, not just vibe-based approval
- `summarize` / `classify` → structured output contract
- `local_companion` → score or confidence + escalation reason
- `interactive_session` → readback from Herdr + downstream verification

## Recommended repo surfaces

This execution standard pairs with:

- `DOCUMENTATION/CODEX-SETUP.md`
- `DOCUMENTATION/CODEX-VS-CLAUDE-SURFACE-MAP.md`
- `DOCUMENTATION/ORGANIZED-ROUTER.md`
- `DOCUMENTATION/PI-AGENT-HARNESS-COMPANION.md`
- `CONFIG/router/`
- `harnesses/pi-agent/`

## Final rule

Use:

- **Herdr** as the default runtime for persistent interactive coding-agent sessions
- **Hermes terminal/tools** as the default runtime for deterministic execution
- **Organized Router** as the decision layer
- **Pi/local harnesses** as opt-in specialist companions

That is the standard.
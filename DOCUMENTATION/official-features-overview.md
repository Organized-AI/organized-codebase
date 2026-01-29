# Extend Claude Code

> **Source:** https://code.claude.com/docs/en/features-overview
>
> Understand when to use CLAUDE.md, Skills, subagents, hooks, MCP, and plugins.

Claude Code combines a model that reasons about your code with built-in tools for file operations, search, execution, and web access. The built-in tools cover most coding tasks. This guide covers the extension layer: features you add to customize what Claude knows, connect it to external services, and automate workflows.

**New to Claude Code?** Start with CLAUDE.md for project conventions. Add other extensions as you need them.

---

## Overview

Extensions plug into different parts of the agentic loop:

- **CLAUDE.md** adds persistent context Claude sees every session
- **Skills** add reusable knowledge and invocable workflows
- **MCP** connects Claude to external services and tools
- **Subagents** run their own loops in isolated context, returning summaries
- **Hooks** run outside the loop entirely as deterministic scripts
- **Plugins** and **marketplaces** package and distribute these features

**Skills** are the most flexible extension. A skill is a markdown file containing knowledge, workflows, or instructions. You can invoke skills with a slash command like `/deploy`, or Claude can load them automatically when relevant. Skills can run in your current conversation or in an isolated context via subagents.

---

## Match Features to Your Goal

Features range from always-on context that Claude sees every session, to on-demand capabilities you or Claude can invoke, to background automation that runs on specific events.

| Feature | What it does | When to use it | Example |
|---------|--------------|----------------|---------|
| **CLAUDE.md** | Persistent context loaded every conversation | Project conventions, "always do X" rules | "Use pnpm, not npm. Run tests before committing." |
| **Skill** | Instructions, knowledge, and workflows Claude can use | Reusable content, reference docs, repeatable tasks | `/review` runs your code review checklist; API docs skill with endpoint patterns |
| **Subagent** | Isolated execution context that returns summarized results | Context isolation, parallel tasks, specialized workers | Research task that reads many files but returns only key findings |
| **MCP** | Connect to external services | External data or actions | Query your database, post to Slack, control a browser |
| **Hook** | Deterministic script that runs on events | Predictable automation, no LLM involved | Run ESLint after every file edit |

**Plugins** are the packaging layer. A plugin bundles skills, hooks, subagents, and MCP servers into a single installable unit.

---

## Compare Similar Features

### Skill vs Subagent

Skills and subagents solve different problems:

- **Skills** are reusable content you can load into any context
- **Subagents** are isolated workers that run separately from your main conversation

| Aspect | Skill | Subagent |
|--------|-------|----------|
| **What it is** | Reusable instructions, knowledge, or workflows | Isolated worker with its own context |
| **Key benefit** | Share content across contexts | Context isolation. Work happens separately, only summary returns |
| **Best for** | Reference material, invocable workflows | Tasks that read many files, parallel work, specialized workers |

**Skills can be reference or action.** Reference skills provide knowledge Claude uses throughout your session (like your API style guide). Action skills tell Claude to do something specific (like `/deploy` that runs your deployment workflow).

**Use a subagent** when you need context isolation or when your context window is getting full.

**They can combine.** A subagent can preload specific skills (`skills:` field). A skill can run in isolated context using `context: fork`.

### CLAUDE.md vs Skill

Both store instructions, but they load differently and serve different purposes.

| Aspect | CLAUDE.md | Skill |
|--------|-----------|-------|
| **Loads** | Every session, automatically | On demand |
| **Can include files** | Yes, with `@path` imports | Yes, with `@path` imports |
| **Can trigger workflows** | No | Yes, with `/<name>` |
| **Best for** | "Always do X" rules | Reference material, invocable workflows |

**Put it in CLAUDE.md** if Claude should always know it: coding conventions, build commands, project structure, "never do X" rules.

**Put it in a skill** if it's reference material Claude needs sometimes (API docs, style guides) or a workflow you trigger with `/<name>`.

**Rule of thumb:** Keep CLAUDE.md under ~500 lines. If it's growing, move reference content to skills.

### MCP vs Skill

MCP connects Claude to external services. Skills extend what Claude knows, including how to use those services effectively.

| Aspect | MCP | Skill |
|--------|-----|-------|
| **What it is** | Protocol for connecting to external services | Knowledge, workflows, and reference material |
| **Provides** | Tools and data access | Knowledge, workflows, reference material |
| **Examples** | Slack integration, database queries, browser control | Code review checklist, deploy workflow, API style guide |

**MCP** gives Claude the ability to interact with external systems. Without MCP, Claude can't query your database or post to Slack.

**Skills** give Claude knowledge about how to use those tools effectively, plus workflows you can trigger with `/<name>`.

**Example:** An MCP server connects Claude to your database. A skill teaches Claude your data model, common query patterns, and which tables to use for different tasks.

---

## Understand How Features Layer

Features can be defined at multiple levels: user-wide, per-project, via plugins, or through managed policies. When the same feature exists at multiple levels:

- **CLAUDE.md files** are additive: all levels contribute content simultaneously
- **Skills and subagents** override by name: when the same name exists at multiple levels, one definition wins based on priority
- **MCP servers** override by name: local > project > user
- **Hooks** merge: all registered hooks fire for their matching events regardless of source

### Combine Features

Each extension solves a different problem. Real setups combine them based on your workflow.

| Pattern | How it works | Example |
|---------|--------------|---------|
| **Skill + MCP** | MCP provides the connection; a skill teaches Claude how to use it well | MCP connects to your database, a skill documents your schema and query patterns |
| **Skill + Subagent** | A skill spawns subagents for parallel work | `/review` skill kicks off security, performance, and style subagents |
| **CLAUDE.md + Skills** | CLAUDE.md holds always-on rules; skills hold reference material loaded on demand | CLAUDE.md says "follow our API conventions," a skill contains the full API style guide |
| **Hook + MCP** | A hook triggers external actions through MCP | Post-edit hook sends a Slack notification when Claude modifies critical files |

---

## Understand Context Costs

Every feature you add consumes some of Claude's context. Too much can fill up your context window, but it can also add noise that makes Claude less effective.

### Context Cost by Feature

| Feature | When it loads | What loads | Context cost |
|---------|---------------|------------|--------------|
| **CLAUDE.md** | Session start | Full content | Every request |
| **Skills** | Session start + when used | Descriptions at start, full content when used | Low (descriptions every request)* |
| **MCP servers** | Session start | All tool definitions and schemas | Every request |
| **Subagents** | When spawned | Fresh context with specified skills | Isolated from main session |
| **Hooks** | On trigger | Nothing (runs externally) | Zero, unless hook returns additional context |

*By default, skill descriptions load at session start so Claude can decide when to use them. Set `disable-model-invocation: true` in a skill's frontmatter to hide it from Claude entirely until you invoke it manually.

### Understand How Features Load

**CLAUDE.md**
- **When:** Session start
- **What loads:** Full content of all CLAUDE.md files (managed, user, and project levels)
- **Tip:** Keep CLAUDE.md under ~500 lines. Move reference material to skills.

**Skills**
- **When:** Depends on configuration. By default, descriptions load at session start and full content loads when used
- **What loads:** Names and descriptions in every request. Full content when invoked
- **Tip:** Use `disable-model-invocation: true` for skills with side effects

**MCP servers**
- **When:** Session start
- **What loads:** All tool definitions and JSON schemas from connected servers
- **Tip:** Run `/mcp` to see token costs per server. Disconnect servers you're not actively using.

**Subagents**
- **When:** On demand, when you or Claude spawns one
- **What loads:** Fresh, isolated context with specified skills
- **Tip:** Use subagents for work that doesn't need your full conversation context

**Hooks**
- **When:** On trigger
- **What loads:** Nothing by default. Hooks run as external scripts
- **Context cost:** Zero, unless the hook returns output that gets added as messages

---

## Learn More

Each feature has its own guide with setup instructions, examples, and configuration options:

- **CLAUDE.md** - Store project context, conventions, and instructions
- **Skills** - Give Claude domain expertise and reusable workflows
- **Subagents** - Offload work to isolated context
- **MCP** - Connect Claude to external services
- **Hooks** - Run scripts on Claude Code events
- **Plugins** - Bundle and share feature sets
- **Marketplaces** - Host and distribute plugin collections

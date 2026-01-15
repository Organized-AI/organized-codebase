# Boris Methodology - Quick Reference Card

**Source:** Boris (Claude Code Creator) Interview
**Video:** https://www.youtube.com/watch?v=B-UXpneKw6M

---

## The Core Philosophy

> "Always give Claude a way to verify its work."

This is the single most important insight. Everything else supports this.

---

## 7 Key Principles

| # | Principle | Action |
|---|-----------|--------|
| 1 | **Verification loops** | Tests, linters, hooks, screenshots |
| 2 | **Plan before execute** | Always plan mode first |
| 3 | **Team-maintained CLAUDE.md** | Update when Claude makes mistakes |
| 4 | **Structured permissions** | Allow/Ask/Deny - never skip |
| 5 | **Opus 4.5 with thinking** | Slower but fewer corrections |
| 6 | **Orchestration mindset** | Claude controls all tools |
| 7 | **Parallel sessions** | 5 numbered tabs, cloud agents |

---

## Daily Workflow

```
Morning:
├── Start 5 parallel sessions (numbered tabs)
├── /status to check project health
└── Review overnight cloud agent results

Feature Development:
├── 1. Plan mode first (always)
├── 2. Describe verification approach
├── 3. Auto-accept mode for execution
├── 4. Hooks verify automatically
└── 5. Commit with /commit

Long Tasks:
├── Put in background or cloud
├── Continue other work
└── Teleport when done

PR Review:
├── @claude-bot reviews
├── Mistakes → CLAUDE.md
└── Team learns from errors
```

---

## CLAUDE.md Template (Keep < 2.5k tokens)

```markdown
# [Project]

## Stack
[Runtime, framework, key deps]

## Structure
[Brief folder map]

## Conventions
[3-5 key patterns]

## DO NOT
- [Anti-pattern from error 1]
- [Anti-pattern from error 2]
- [Anti-pattern from error 3]

## Verification
Before completing work:
1. Describe verification approach
2. Run tests
3. Run linters
```

---

## Permission Tiers

| Tier | Examples | Action |
|------|----------|--------|
| **Allow** | git status, npm test, ls | Run immediately |
| **Ask** | git commit, rm, npm install | Prompt first |
| **Deny** | git push --force, sudo, rm -rf / | Block always |

---

## Verification Methods

| Domain | Method |
|--------|--------|
| Code | Tests + linters |
| UI | Screenshots, browser extension |
| API | curl/httpie verification |
| Mobile | iOS/Android simulator MCPs |
| Build | Clean install + build + smoke test |

---

## Essential Slash Commands

| Command | Purpose |
|---------|---------|
| `/verify` | Run all verification checks |
| `/commit` | Smart commit with verification |
| `/review` | Self-review before PR |
| `/status` | Project health check |
| `/test` | Tests with coverage |
| `/plan` | Enter planning mode |

---

## Subagent Types

| Agent | Purpose |
|-------|---------|
| Architecture | Verify code structure |
| Refactor | Review refactoring quality |
| Build | Validate builds work |
| Background | Run long tasks silently |

---

## Parallel Session Setup

```
[1] CC-Main      Primary development
[2] CC-Tests     Running test suites
[3] CC-Backend   API/server work
[4] CC-Frontend  UI/client work
[5] CC-Deploy    Build and deployment
```

---

## Cloud Agent Workflow

```
1. Assign long-running task
2. Put in background
3. Work on phone or other session
4. Claude works autonomously
5. Creates branch when done
6. Teleport to bring back locally
7. Review and merge
```

---

## Model Strategy

| Model | When |
|-------|------|
| **Opus 4.5 + Thinking** | Complex tasks (default) |
| Sonnet | Routine/simple tasks |
| Haiku | Quick lookups only |

> "Overall time spent is lower with Opus because fewer corrections needed"

---

## Phase Implementation Order

```
Phase 0: CLAUDE.md Enhancement
    ↓
Phase 1: Permission System
    ↓
Phase 2: Verification Infrastructure
    ↓
Phase 3: Slash Commands
    ↓
Phase 4: Subagents
    ↓
Phase 5: MCP Orchestration
    ↓
Phase 6: Parallel & Cloud Sessions
```

---

## Quick Wins (Do Today)

1. [ ] Add 3 "DO NOT" anti-patterns to CLAUDE.md
2. [ ] Create `/verify` slash command
3. [ ] Set up linting if not present
4. [ ] Add permissions deny list
5. [ ] Start using plan mode before features

---

## Resources

- **Video:** https://www.youtube.com/watch?v=B-UXpneKw6M
- **Claude Browser Extension:** For UI verification
- **Ralph Wigum Plugin:** Removes human from verification loop
- **GitHub Action:** claude-code-action for PR reviews

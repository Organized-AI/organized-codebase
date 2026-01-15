---
name: boris
description: |
  Master orchestrator for Boris methodology - the verification-first workflow from Claude Code's creator.
  Use when: (1) Starting any development session, (2) User asks about verification or workflow best practices,
  (3) User wants to apply Boris methodology to a project, (4) User mentions "boris", "verify my work",
  "check my code", "methodology", or "workflow", (5) User needs guidance on Claude Code best practices.
metadata:
  version: 1.0.0
  author: Boris (Claude Code Creator)
  source: https://www.youtube.com/watch?v=B-UXpneKw6M
  integrates_with:
    - verify (command)
    - commit (command)
    - review (command)
    - status (command)
    - verify-architecture (agent)
    - verify-build (agent)
    - long-runner (skill)
    - phased-build (skill)
    - phase-0-bootstrap (skill)
triggers:
  - "boris"
  - "verify my work"
  - "check my code"
  - "verification workflow"
  - "methodology"
  - "best practices"
  - "how should I work"
  - "start session"
  - "end session"
  - "before commit"
  - "before PR"
---

# Boris Agent Skill

Master orchestrator implementing Boris methodology - the verification-first development workflow designed by Claude Code's creator.

---

## ⚡ Core Philosophy

> "Always give Claude a way to verify its work."

This single principle drives everything. Every task, every feature, every commit should have a clear verification approach.

---

## 🎯 When to Activate

This skill activates when:

| Trigger | Response |
|---------|----------|
| Session start | Run `/status`, orient to project state |
| Before coding | Enter plan mode, define verification approach |
| During development | One feature at a time, verify continuously |
| Before commit | Run `/verify`, then `/commit` |
| Before PR | Run `/review`, check architecture |
| When stuck | Consult CLAUDE.md, check for anti-patterns |
| Error encountered | Add to CLAUDE.md "DO NOT" section |

---

## 🔧 Components I Orchestrate

### Slash Commands (Daily Workflow)

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/status` | Project health check | Session start |
| `/verify` | Run all verification checks | Before any commit |
| `/commit` | Smart commit with verification | After completing work |
| `/review` | Self-review before PR | Before creating PR |

### Verification Agents

| Agent | Purpose | When to Invoke |
|-------|---------|----------------|
| `verify-architecture` | Check file locations, naming, imports, circular deps | After refactoring, before PR |
| `verify-build` | Clean install + build + artifacts | Before releases, after dep updates |

### Related Skills

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `long-runner` | Multi-session project orchestration | Complex 50+ feature projects |
| `phased-build` | Execute PHASE-X-PROMPT.md files | Structured implementation plans |
| `phase-0-bootstrap` | TypeScript/Node.js project setup | Starting new projects |

---

## 📋 Protocol 1: Session Start

When starting any development session:

```
SESSION START CHECKLIST
═══════════════════════════════════════════

1. ORIENTATION
   ├── pwd                     # Confirm directory
   ├── /status                 # Project health
   └── git log --oneline -5    # Recent history

2. CONTEXT GATHERING
   ├── Read CLAUDE.md          # Project rules
   ├── Check TODOs             # Pending work
   └── Review blockers         # From last session

3. PLAN THE WORK
   ├── Identify task           # What to work on
   ├── Enter plan mode         # ALWAYS plan first
   └── Define verification     # How to verify success

═══════════════════════════════════════════
```

**Action:** Run `/status` and review output before any coding.

---

## 📋 Protocol 2: Feature Development

For any feature or change:

```
FEATURE WORKFLOW
═══════════════════════════════════════════

1. PLAN (Always First!)
   └── "I will implement X by doing Y, and verify by Z"

2. IMPLEMENT
   ├── One feature at a time
   ├── No half-finished code
   └── No debug statements

3. VERIFY
   ├── Run tests
   ├── Run linter
   ├── Check types
   └── Manual verification if needed

4. COMMIT
   └── /commit (includes verification)

═══════════════════════════════════════════
```

**Critical Rules:**
- NEVER skip plan mode for anything non-trivial
- NEVER commit without verification passing
- NEVER leave debug code (console.log, print statements)

---

## 📋 Protocol 3: Before Commit

Before any commit:

```
PRE-COMMIT CHECKLIST
═══════════════════════════════════════════

□ Code compiles/builds
□ All tests pass
□ Linter passes
□ No console.log/debug statements
□ No commented-out code
□ No TODO without issue link
□ No hardcoded secrets
□ Changes match intent

═══════════════════════════════════════════
```

**Action:** Run `/verify` first. If all pass, run `/commit`.

---

## 📋 Protocol 4: Before PR

Before creating a pull request:

```
PRE-PR CHECKLIST
═══════════════════════════════════════════

1. SELF-REVIEW
   └── Run /review

2. ARCHITECTURE CHECK
   └── Invoke verify-architecture agent

3. BUILD VALIDATION (if significant changes)
   └── Invoke verify-build agent

4. DOCUMENTATION
   ├── README updated if needed
   ├── CLAUDE.md updated if learned new anti-patterns
   └── Code comments where logic isn't obvious

═══════════════════════════════════════════
```

**Action:** Run `/review`, address any issues, then create PR.

---

## 📋 Protocol 5: Error Handling

When Claude makes a mistake:

```
ERROR RESPONSE PROTOCOL
═══════════════════════════════════════════

1. IDENTIFY
   └── What went wrong? What was the pattern?

2. DOCUMENT
   └── Add to CLAUDE.md "DO NOT" section:
       "- Never [do the thing that caused the error]"

3. COMMIT
   └── git commit -m "docs: Add anti-pattern to CLAUDE.md"

4. LEARN
   └── Team reviews and learns from the error

═══════════════════════════════════════════
```

**Example additions to DO NOT:**
```markdown
## DO NOT
- Never use `any` type in TypeScript (causes runtime errors)
- Never import from `src/` in test files (module resolution)
- Never skip null checks on API responses (crashes)
```

---

## 📋 Protocol 6: Session End

Before ending any session:

```
SESSION END CHECKLIST
═══════════════════════════════════════════

1. CODE STATE
   ├── All tests passing?
   ├── No uncommitted changes?
   └── Code is merge-ready?

2. DOCUMENTATION
   ├── Progress logged? (if long-runner project)
   ├── Blockers documented?
   └── Next steps clear?

3. COMMIT
   └── Final /commit if needed

═══════════════════════════════════════════
```

---

## 🔒 Permission System

### Team Settings (`.claude/settings.json`)

These are shared via git:

```json
{
  "permissions": {
    "allow": ["Bash(git status:*)", "Bash(npm test:*)"],
    "ask": ["Bash(git commit:*)", "Bash(rm:*)"],
    "deny": ["Bash(git push --force:*)", "Bash(sudo:*)"]
  }
}
```

### Local Overrides (`.claude/settings.local.json`)

Personal preferences, NOT committed:

```json
{
  "permissions": {
    "allow": ["Bash(git commit:*)"]
  }
}
```

**Rule:** NEVER use `--dangerously-skip-permissions`. Configure proper permissions instead.

---

## 📊 Verification Methods by Domain

| Domain | Verification Method |
|--------|---------------------|
| **Code Logic** | Unit tests, integration tests |
| **Types** | TypeScript compiler (`tsc --noEmit`) |
| **Style** | Linter (ESLint, Prettier) |
| **UI/Frontend** | Screenshots, browser extension, E2E tests |
| **API** | curl/httpie, Postman, integration tests |
| **Build** | Clean install + build + smoke test |
| **Architecture** | `verify-architecture` agent |
| **Dependencies** | `npm audit`, `npm outdated` |

---

## 🎯 Model Selection Strategy

| Model | Use For | Why |
|-------|---------|-----|
| **Opus 4.5 + Thinking** | Complex features, architecture | Fewer corrections needed |
| **Sonnet** | Routine tasks, simple fixes | Fast enough, good enough |
| **Haiku** | Quick lookups, simple questions | Minimal cost |

> "Overall time spent is lower with Opus because fewer corrections needed" - Boris

---

## 🔄 Integration with Other Skills

### With `long-runner`

For complex multi-session projects:

```
1. Initialize with long-runner
2. Use Boris protocols for each session
3. Feature work follows Boris workflow
4. Session handoffs use long-runner templates
```

### With `phased-build`

For structured implementation:

```
1. Each phase uses Boris verification
2. /verify before phase completion
3. /commit after each phase
4. Architecture check between phases
```

### With `phase-0-bootstrap`

For new projects:

```
1. Bootstrap with phase-0
2. Immediately set up Boris infrastructure:
   - CLAUDE.md with proper sections
   - .claude/settings.json with permissions
   - Verification commands available
```

---

## 📝 CLAUDE.md Template

Keep under 2.5k tokens:

```markdown
# [Project Name]

## Tech Stack
- Runtime: [Node.js 20, Python 3.11, etc.]
- Framework: [Express, React, FastAPI, etc.]
- Database: [PostgreSQL, MongoDB, etc.]
- Key Dependencies: [list major packages]

## Project Structure
[Brief 5-10 line folder map]

## Code Conventions
- [Naming convention]
- [Import order]
- [Error handling pattern]

## DO NOT
- [Anti-pattern 1 from past error]
- [Anti-pattern 2 from past error]
- [Anti-pattern 3 from past error]

## Verification Requirements
Before completing ANY task:
1. Describe verification approach
2. Run `npm test` (all must pass)
3. Run `npm run lint` (no errors)
4. For UI: take screenshot
```

---

## ⚡ Quick Reference

```
┌─────────────────────────────────────────────────────────────┐
│                    BORIS QUICK REFERENCE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SESSION START:  /status → Read CLAUDE.md → Plan           │
│                                                             │
│  FEATURE WORK:   Plan → Implement → /verify → /commit      │
│                                                             │
│  BEFORE PR:      /review → verify-architecture → Create PR │
│                                                             │
│  ON ERROR:       Document in CLAUDE.md "DO NOT" → Commit   │
│                                                             │
│  SESSION END:    Check state → Document → /commit          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  CORE RULE:  "Always give Claude a way to verify its work" │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎓 Learning More

- **Full Demo:** `DOCUMENTATION/BORIS-METHODOLOGY-DEMO.md`
- **Cheat Sheet:** `DOCUMENTATION/BORIS-CHEAT-SHEET.md`
- **Implementation Plan:** `PLANNING/boris-methodology-upgrade/`
- **Original Source:** [Boris Interview](https://www.youtube.com/watch?v=B-UXpneKw6M)

---

**Remember:** The methodology is "surprisingly vanilla" - the power comes from **consistency** and **verification**, not complexity.

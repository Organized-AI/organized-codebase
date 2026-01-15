# Boris Methodology - Demonstration Guide

Quick reference for using the Boris methodology components in this codebase.

---

## 1. Slash Commands (Inner Loop)

These commands are your daily workflow. Use them frequently.

### `/verify` - Run Verification Checks

**When:** Before committing, after making changes, when unsure if code works.

```
/verify
```

**Example Output:**
```
═══════════════════════════════════════════
  VERIFICATION REPORT
═══════════════════════════════════════════

Git Status:     ⚠️ 3 uncommitted changes
Linting:        ✅ Passed
Type Check:     ✅ Passed
Tests:          ✅ 42 passing
Build:          ✅ Passed

Overall:        ✅ READY TO COMMIT
═══════════════════════════════════════════
```

---

### `/commit` - Smart Commit with Verification

**When:** After completing a feature or fix.

```
/commit
```

**What it does:**
1. Runs `/verify` first (stops if fails)
2. Shows `git diff --stat`
3. Generates conventional commit message
4. Asks for confirmation before committing
5. Never auto-pushes

**Example:**
```
═══════════════════════════════════════════
  SMART COMMIT
═══════════════════════════════════════════

Verification: ✅ All checks passed

Changes to commit:
 M src/utils/parser.ts
 A src/utils/validator.ts
 M tests/parser.test.ts

Proposed commit message:
────────────────────────────────────────────
feat(utils): Add input validator with schema support

- Created validator.ts with JSON schema validation
- Updated parser to use validator
- Added comprehensive tests

🤖 Generated with [Claude Code](https://claude.com/claude-code)
────────────────────────────────────────────

Proceed with commit? [y/n]
═══════════════════════════════════════════
```

---

### `/status` - Project Health Check

**When:** Start of each session, to understand project state.

```
/status
```

**Example Output:**
```
═══════════════════════════════════════════
  PROJECT STATUS
═══════════════════════════════════════════

📁 Project: organized-codebase
🌿 Branch:  feature/boris-methodology → origin/feature/boris-methodology
📊 Status:  Clean

Recent Commits:
  abc1234 feat: Add verification commands
  def5678 fix: Resolve type errors
  ghi9012 docs: Update CLAUDE.md

Dependencies: ✅ All up to date
Tests:        ✅ 42 passing, 87% coverage
Build:        ✅ Successful
TODOs Found:  3 items

═══════════════════════════════════════════
Overall Health: ✅ HEALTHY
═══════════════════════════════════════════
```

---

### `/review` - Self-Review Before PR

**When:** Before creating a pull request.

```
/review
```

**What it checks:**
- No `console.log` statements
- No commented-out code
- No TODOs without issue links
- No hardcoded values
- No secrets/API keys
- Tests exist for new code
- Documentation updated

---

## 2. Verification Agents

These agents run deeper verification checks.

### verify-architecture

**When:** After adding new files, refactoring, or before PR.

**Invoke:**
```
Run the verify-architecture agent to check my recent changes
```

**Checks:**
- Files in correct directories
- Naming conventions followed
- No circular dependencies
- Import order consistent

---

### verify-build

**When:** Before releases, after dependency updates.

**Invoke:**
```
Run verify-build to validate from clean state
```

**Checks:**
- Clean `npm ci` succeeds
- Build completes without errors
- Artifacts generated correctly
- Smoke test passes

---

## 3. Skills in Action

### `/phased-build` - Multi-Phase Development

**When:** Project has `PLANNING/implementation-phases/` structure.

```
/phased-build
```

**Or specific phase:**
```
Run phase 3
Continue from phase 2
Check phase status
```

**Example Status Output:**
```
Phase Status:
  ✅ PHASE-0-PROMPT.md → PHASE-0-COMPLETE.md
  ✅ PHASE-1-PROMPT.md → PHASE-1-COMPLETE.md
  ⏳ PHASE-2-PROMPT.md → (pending)
  ⏳ PHASE-3-PROMPT.md → (pending)

Next: Phase 2 - Campaign Management
```

---

### `/long-runner` - Multi-Session Projects

**When:** Complex project requiring multiple sessions.

**Start new project:**
```
Start a long-running project for [description]
```

**Continue existing:**
```
Continue the project
Pick up where we left off
```

**Check status:**
```
What's the feature status?
```

**Key Artifacts Created:**
- `feature_list.json` - All features with pass/fail status
- `claude-progress.txt` - Session log
- `init.sh` - Dev environment setup

---

## 4. Permission System

### Team Settings (`.claude/settings.json`)

Shared with team via git:

```json
{
  "permissions": {
    "allow": [
      "Bash(git status:*)",
      "Bash(npm test:*)",
      "Bash(npm run lint:*)"
    ],
    "ask": [
      "Bash(git commit:*)",
      "Bash(rm:*)"
    ],
    "deny": [
      "Bash(git push --force:*)",
      "Bash(sudo:*)"
    ]
  }
}
```

### Local Overrides (`.claude/settings.local.json`)

Personal settings, NOT committed:

```json
{
  "permissions": {
    "allow": [
      "Bash(git commit:*)"  // You trust yourself more
    ]
  }
}
```

---

## 5. CLAUDE.md Anti-Pattern Workflow

### When Claude Makes a Mistake

1. **Identify the error type**
2. **Add to CLAUDE.md "DO NOT" section**
3. **Commit the update**

**Example:**
```markdown
## DO NOT
- Never use `--dangerously-skip-permissions`
- Never skip plan mode for complex features
- Never commit without running verification
- Never use `any` type in TypeScript (added after type error)
- Never import from `src/` in test files (added after module resolution error)
```

---

## 6. Daily Workflow Pattern

```
MORNING ROUTINE
├── /status                    # Check project health
├── Review claude-progress.txt  # (if long-runner project)
└── Check TODOs/blockers

FEATURE DEVELOPMENT
├── Plan mode first (always!)
├── Describe verification approach
├── Implement (one feature at a time)
├── /verify
├── /commit
└── Repeat

BEFORE PR
├── /review                    # Self-review
├── verify-architecture agent  # Check structure
└── /commit (final cleanup)

END OF SESSION
├── Update progress files
├── /commit (if changes)
└── Document blockers for next session
```

---

## 7. Quick Command Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/verify` | Run all checks | Before any commit |
| `/commit` | Smart commit | After completing work |
| `/review` | Self-review | Before PR |
| `/status` | Health check | Start of session |
| `/phased-build` | Execute phases | Structured projects |
| `/long-runner` | Multi-session | Complex projects |
| `/new-project` | Create project | Starting fresh |

---

## 8. Model Selection Strategy

| Model | Use For |
|-------|---------|
| **Opus 4.5 + Thinking** | Complex features, architecture decisions |
| **Sonnet** | Routine tasks, quick fixes |
| **Haiku** | Quick lookups, simple questions |

> "Overall time spent is lower with Opus because fewer corrections needed" - Boris

---

**Remember the Core Philosophy:**

> "Always give Claude a way to verify its work."

Every task should have:
1. A clear verification approach
2. Automated checks where possible
3. Results documented

---

*Source: Boris (Claude Code Creator) - [Interview](https://www.youtube.com/watch?v=B-UXpneKw6M)*

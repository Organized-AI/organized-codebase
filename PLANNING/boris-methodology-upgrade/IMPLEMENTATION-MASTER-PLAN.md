# Claude Code Methodology Upgrade - Master Plan

**Created:** January 13, 2026
**Source:** Boris (Claude Code Creator) Interview Insights
**Project Path:** Organized Codebase
**Goal:** Upgrade Claude Code workflow to match creator's recommended methodology

---

## Executive Summary

This plan extracts actionable improvements from Boris's interview, organized into 7 phases. Boris emphasizes that his workflow is "surprisingly vanilla" - the power comes from **verification loops**, **proper planning**, and **team collaboration on claude.md**.

---

## Key Principles from Boris

1. **Always give Claude a way to verify its work** - The single biggest insight
2. **claude.md should be unique and team-maintained** - Updated multiple times per week
3. **Plan mode FIRST, then auto-accept** - Never skip the planning phase
4. **Use Opus 4.5 with thinking** - Slower but fewer steering corrections needed
5. **Permissions > dangerous mode** - Allowlist commands, don't skip safety
6. **Claude Code is an orchestrator** - Not just for code, but for all workflows
7. **Parallel sessions with numbered tabs** - Scale to 5+ sessions

---

## Current State Assessment

| Component | Current Status | Gap |
|-----------|---------------|-----|
| CLAUDE.md | Minimal (byterover MCP only) | Missing: tech stack, conventions, anti-patterns |
| Permissions | Basic allow list | Missing: structured deny/ask rules |
| Verification | None systematic | Missing: test-driven workflow, linters |
| Slash Commands | 1 command (new-project) | Missing: inner loop workflows |
| Subagents | Skills exist | Missing: verification agents |
| MCP Integration | None visible | Missing: Slack, BigQuery, Notion |
| Hooks | Empty | Missing: stop hooks for verification |

---

## Implementation Phases Overview

| Phase | Name | Focus | Dependencies |
|-------|------|-------|--------------|
| 0 | CLAUDE.md Enhancement | Project context & anti-patterns | None |
| 1 | Permission System | Structured allow/deny/ask | Phase 0 |
| 2 | Verification Infrastructure | Tests, linters, hooks | Phase 1 |
| 3 | Slash Commands & Inner Loop | Repetitive workflow automation | Phase 2 |
| 4 | Subagents & Background Tasks | Verification agents, async work | Phase 3 |
| 5 | MCP Orchestration Layer | External tool integration | Phase 4 |
| 6 | Parallel Workflows | Multi-session, cloud agents | Phase 5 |

---

## Phase Details

### Phase 0: CLAUDE.md Enhancement
**Files:** `CLAUDE.md`
**Token Budget:** Keep under 2.5k tokens (Boris's recommendation)

Boris emphasizes:
- Tech stack documentation
- Basic project structure
- Code style and conventions
- **Things Claude should NOT do** (anti-patterns from errors)
- Team contribution workflow

### Phase 1: Permission System Setup
**Files:** `.claude/settings.json`, `.claude/settings.local.json`

Boris says:
- Never use `--dangerously-skip-permissions`
- Set allowed commands at project level
- Share with team via settings.json

### Phase 2: Verification Infrastructure
**Files:** Tests, linter configs, hooks

Boris's verification approaches:
1. Test-driven development (tests first)
2. Stop hooks for automatic verification
3. Linters/formatters for code quality
4. Browser extension for UI verification
5. Screenshots for visual verification

### Phase 3: Slash Commands & Inner Loop
**Files:** `.claude/commands/*.md`

Boris calls repetitive workflows "inner loop workflows":
- Commit all to git
- Share commands via git

### Phase 4: Subagents & Background Tasks
**Files:** Subagent definitions

Boris's subagent use cases:
- Verify architecture correctness
- Refactor written code
- Validate final builds work
- Background long-running tasks

### Phase 5: MCP Orchestration Layer
**Files:** MCP configurations

Boris uses Claude as orchestrator for:
- Slack (via MCP)
- BigQuery (via CLI)
- Sentry (via CLI)
- Other internal tools

### Phase 6: Parallel Workflows & Cloud Sessions
**Documentation:** Workflow guides

Boris's scaling approach:
- 5 parallel Claude Code sessions
- Numbered tabs for notification tracking
- Web/cloud sessions for long tasks
- Teleport command to bring back locally
- GitHub Actions bot for PR reviews

---

## Success Criteria

- [ ] CLAUDE.md under 2.5k tokens with full context
- [ ] Permission system with explicit allow/deny/ask
- [ ] At least 3 verification methods active
- [ ] 5+ slash commands for inner loop
- [ ] 3+ subagents for verification
- [ ] 1+ MCP integration working
- [ ] Documented parallel session workflow

---

## Execution Order

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
   │         │         │         │         │         │         │
   ▼         ▼         ▼         ▼         ▼         ▼         ▼
CLAUDE.md  Perms    Verify   Commands  Agents    MCPs     Scale
```

---

## Notes

- Each phase has its own prompt file in this directory
- Complete phases in order (dependencies matter)
- Git commit after each phase
- Update CLAUDE.md with learnings from each phase

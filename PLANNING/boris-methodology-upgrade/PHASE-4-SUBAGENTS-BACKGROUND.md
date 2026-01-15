# Phase 4: Subagents & Background Tasks

**Objective:** Create specialized subagents for verification and automation

---

## Boris's Key Insights

> "Boris uses sub agents to automate simple workflows that require completely different instructions."

> "Most of his agents are used to verify that the architecture of his code is correct, to refactor the code that's been written, and to validate that the final builds actually work."

> "The first is asking Claude to verify its work using different tests that Claude code itself comes up with and then putting those tasks into the background."

> "These are just background tasks that run silently and report back to the main agent once they're done."

---

## Current State

You have existing subagent infrastructure in `.claude/skills/` but missing:
- Architecture verification agent
- Refactoring agent
- Build validation agent
- Background task patterns

---

## Target Subagent Architecture

### Core Verification Agents

```
.claude/agents/
├── verify-architecture.md    # Check code architecture
├── verify-refactor.md        # Review refactoring quality
├── verify-build.md           # Validate builds work
└── background-runner.md      # Long-running task executor
```

---

## Agent Definitions

### Architecture Verification Agent
```markdown
# Architecture Verification Agent

## Purpose
Verify code follows established architectural patterns.

## Checks
1. **Directory Structure**
   - Files in correct locations
   - No misplaced modules

2. **Dependency Direction**
   - Dependencies flow correctly
   - No circular imports
   - Layer boundaries respected

3. **Naming Conventions**
   - Files match patterns
   - Exports consistent

4. **Pattern Adherence**
   - Components follow template
   - Services follow pattern
   - Utils are pure functions

## Output
Return structured report:
- ✅ Passed checks
- ⚠️ Warnings
- ❌ Violations

## Usage
Invoke after significant code changes or new modules.
```

### Refactoring Verification Agent
```markdown
# Refactoring Verification Agent

## Purpose
Ensure refactoring improves code without breaking functionality.

## Pre-Refactor
1. Run all tests (baseline)
2. Note current coverage
3. Snapshot current behavior

## Post-Refactor Checks
1. **All tests still pass**
2. **Coverage maintained or improved**
3. **No new lint errors**
4. **Code complexity reduced**
   - Fewer lines (if appropriate)
   - Simpler functions
   - Better naming

5. **Behavior unchanged**
   - Same inputs produce same outputs
   - API contracts maintained

## Output
- Before/After comparison
- Risk assessment
- Recommendation: Safe / Review Needed / Rollback

## Usage
Invoke after any refactoring session.
```

### Build Validation Agent
```markdown
# Build Validation Agent

## Purpose
Verify the project builds and runs correctly.

## Checks
1. **Clean Install**
   ```bash
   rm -rf node_modules
   npm ci
   ```

2. **Build Process**
   ```bash
   npm run build
   ```

3. **Build Artifacts**
   - Expected files exist
   - No build errors
   - Correct output structure

4. **Smoke Test**
   - Start the application
   - Verify it runs without crash
   - Basic health check

## Output
- Build status: Success / Failed
- Build time
- Artifact sizes
- Any warnings

## Usage
Invoke before merge to main or deployment.
```

### Background Task Runner
```markdown
# Background Task Runner

## Purpose
Execute long-running tasks without blocking main workflow.

## Task Types
1. **Test Suites**
   - Full test run in background
   - Report when complete

2. **Dependency Audits**
   - npm audit
   - Check for vulnerabilities

3. **Code Analysis**
   - Complexity metrics
   - Dead code detection

4. **Documentation Generation**
   - Build docs in background
   - Notify when ready

## Execution Pattern
1. Start task in background
2. Continue with other work
3. Receive notification on completion
4. Review results

## Output
Background task ID and status on completion.
```

---

## Tasks

1. **Create agents directory**
   ```bash
   mkdir -p .claude/agents
   ```

2. **Write agent definitions**
   - verify-architecture.md
   - verify-refactor.md
   - verify-build.md
   - background-runner.md

3. **Customize for your project**
   - Adjust architecture checks to your patterns
   - Add project-specific validations
   - Define your smoke tests

4. **Test each agent**
   - Invoke manually
   - Verify output is useful
   - Adjust prompts

5. **Document in CLAUDE.md**
   - List available agents
   - When to use each
   - How to invoke

---

## Background Task Pattern

Boris's approach:
```
1. Start long-running task
2. Put in background
3. Continue working
4. Get notification when done
5. Review results
```

Implementation:
```markdown
## Background Execution

To run verification in background:
1. State the task clearly
2. Ask Claude to run in background
3. Continue with other work
4. Claude will notify on completion

Example:
"Run full test suite in background while I work on the API"
```

---

## Integration with Slash Commands

Connect agents to commands:

| Command | Agent Used |
|---------|-----------|
| `/verify` | All verification agents |
| `/commit` | verify-build before commit |
| `/review` | verify-architecture + verify-refactor |
| `/deploy` | verify-build (mandatory) |

---

## Verification Checklist

- [ ] All 4 agents created
- [ ] Agents customized for project
- [ ] Each agent tested and working
- [ ] Background task pattern documented
- [ ] Integration with slash commands
- [ ] CLAUDE.md updated with agent usage

---

## Prompt Template

```
Create subagents for verification:

1. Create .claude/agents/ directory
2. Create these agent files:
   - verify-architecture.md
   - verify-refactor.md
   - verify-build.md
   - background-runner.md

Each agent should:
- Have a clear purpose
- Define specific checks
- Provide structured output
- Be invokable from main session

Follow Boris's principle: Use agents for verification and autonomous workflows.
```

---

## Completion

When complete:
1. Test each agent manually
2. Test background execution
3. Git commit: "Phase 4: Verification subagents and background tasks"
4. Move to Phase 5

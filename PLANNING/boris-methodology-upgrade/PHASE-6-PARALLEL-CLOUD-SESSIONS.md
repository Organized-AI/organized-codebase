# Phase 6: Parallel Workflows & Cloud Sessions

**Objective:** Scale to multiple parallel Claude sessions and leverage cloud agents

---

## Boris's Key Insights

> "He also mentions that he runs five of these Claude code sessions in parallel."

> "While working with them, he basically numbers his tabs. He does this so that when he receives notifications from different tabs, he knows which terminal tab they're coming from."

> "He also heavily uses the web sessions of Claude Code. This is where you connect the web version of Claude Code to your GitHub, give it access to a demo repo, and it's able to work on that in the cloud."

> "He uses the background agents feature to put any long-running task into the background. Sometimes he even uses it on his phone where Claude can automatically do all the work in a cloud session."

> "There is also the teleport command which brings the cloud sessions back into the local terminal."

---

## Parallel Session Management

### Terminal Organization

Boris numbers his tabs:
```
Terminal Layout:
┌─────────────────────────────────────────────────────┐
│ [1] Main    │ [2] Tests   │ [3] Backend │ [4] Frontend │ [5] Deploy │
├─────────────────────────────────────────────────────┤
│ Feature     │ Running     │ API work    │ UI work      │ Build &    │
│ development │ tests       │             │              │ deploy     │
└─────────────────────────────────────────────────────┘
```

### Session Naming Convention

```
[1] CC-Main:     Primary development work
[2] CC-Tests:    Running test suites
[3] CC-Backend:  API/server work
[4] CC-Frontend: UI/client work
[5] CC-Deploy:   Build and deployment
```

### Parallel Workflow Patterns

**Pattern 1: Feature + Tests Parallel**
```
Session 1: Implement feature
Session 2: Write tests simultaneously
→ Sync at merge point
```

**Pattern 2: Frontend + Backend Parallel**
```
Session 1: Build API endpoint
Session 2: Build UI component
→ Integrate when both ready
```

**Pattern 3: Code + Documentation Parallel**
```
Session 1: Write code
Session 2: Write documentation
→ Keep in sync
```

---

## Cloud Sessions & Background Agents

### Web Session Setup

1. **Connect GitHub**
   - Authorize Claude web with GitHub
   - Grant access to specific repos

2. **Create Cloud Session**
   - Select repo in web interface
   - Start cloud Claude session

3. **Background Agent Pattern**
   ```
   1. Assign long-running task
   2. Put in background (background agent feature)
   3. Continue on phone or other session
   4. Claude works autonomously
   5. Creates branch when done
   6. Review and merge
   ```

### Teleport Command

Bring cloud sessions back to local:
```bash
claude teleport [session-id]
```

This:
- Downloads cloud session state
- Opens in local terminal
- Full context preserved
- Can continue working locally

---

## GitHub Actions Integration

Boris's PR Review Workflow:

> "During PR reviews, whenever he finds mistakes, he simply asks Claude to add those mistakes to the Claude.md file."

### Setup GitHub Action

Create `.github/workflows/claude-pr.yml`:
```yaml
name: Claude PR Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Claude PR Review
        uses: anthropics/claude-code-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          command: |
            Review this PR for:
            1. Code quality issues
            2. Missing tests
            3. Architecture violations
            4. Security concerns

            If issues found, add to CLAUDE.md anti-patterns.
```

### Calling Claude in Comments

After setup, in any PR:
```
@claude-bot review this PR
@claude-bot add this anti-pattern to CLAUDE.md
@claude-bot suggest tests for this change
```

---

## Opus 4.5 Strategy

Boris's model choice:

> "He pretty much uses Opus 4.5 with thinking enabled for everything. He argues that even though it's a bigger and slower model... it has a much lower chance of making errors. As a result, the overall time spent working with the model and steering it is actually much lower with Opus 4.5."

### When to Use Each Model

| Model | Use Case | Trade-off |
|-------|----------|-----------|
| Opus 4.5 + Thinking | Complex tasks, architecture | Slower, fewer errors |
| Sonnet | Routine tasks, simple edits | Faster, may need steering |
| Haiku | Quick lookups, trivial tasks | Fastest, limited reasoning |

### Configure Default Model

In Claude settings:
```json
{
  "model": "claude-opus-4.5",
  "thinking": true
}
```

---

## Tasks

### Task 1: Set Up Terminal Organization
- Configure terminal to support 5 tabs
- Create naming convention
- Set up quick-switch shortcuts

### Task 2: Create Session Templates
```
.claude/sessions/
├── main-dev.md          # Main development session
├── testing.md           # Test runner session
├── backend.md           # Backend focus session
├── frontend.md          # Frontend focus session
└── deploy.md            # Deployment session
```

### Task 3: Configure Cloud Sessions
- Connect GitHub to Claude web
- Test creating cloud session
- Test background agent feature
- Test teleport command

### Task 4: Set Up GitHub Action
- Create workflow file
- Configure secrets
- Test PR review bot

### Task 5: Document Workflow
Add to CLAUDE.md:
```markdown
## Parallel Session Workflow

I work across multiple sessions:
- [1] Main development
- [2] Testing
- [3] Backend
- [4] Frontend
- [5] Deployment

For long tasks: Use background agents in cloud sessions.
```

---

## Session Communication

When running parallel sessions:

1. **Use git as sync point**
   - Commit frequently
   - Pull before switching focus

2. **Shared CLAUDE.md**
   - Anti-patterns added by any session
   - All sessions read same context

3. **Notification awareness**
   - Numbered tabs for identification
   - Know which session is calling

---

## Verification Checklist

- [ ] Terminal organized with 5+ tabs
- [ ] Session naming convention established
- [ ] Cloud session tested
- [ ] Background agent tested
- [ ] Teleport command tested
- [ ] GitHub Action configured
- [ ] Workflow documented

---

## Prompt Template

```
Set up parallel session infrastructure:

1. Configure terminal for multiple Claude sessions
2. Create session templates for different focuses
3. Document cloud session and background agent workflow
4. Set up GitHub Action for Claude PR reviews

Follow Boris's principle: Scale with parallel sessions and cloud agents.
```

---

## Completion

When complete:
1. Test parallel session workflow
2. Test cloud session → teleport flow
3. Test GitHub Action on a PR
4. Git commit: "Phase 6: Parallel workflows and cloud sessions"
5. Methodology upgrade complete!

---

## Final Integration

After all phases, your workflow should be:

```
Daily Workflow:
1. Start 5 parallel sessions (numbered)
2. Use plan mode before starting features
3. Auto-accept mode for execution
4. Verification runs automatically (hooks)
5. Long tasks go to background/cloud
6. PR reviews via GitHub Action
7. Errors added to CLAUDE.md

Model: Opus 4.5 with thinking (fewer corrections needed)
```

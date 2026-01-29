# Best Practices for Claude Code

> **Source:** https://code.claude.com/docs/en/best-practices
>
> Tips and patterns for getting the most out of Claude Code, from configuring your environment to scaling across parallel sessions.

Claude Code is an agentic coding environment. Unlike a chatbot that answers questions and waits, Claude Code can read your files, run commands, make changes, and autonomously work through problems while you watch, redirect, or step away entirely.

This changes how you work. Instead of writing code yourself and asking Claude to review it, you describe what you want and Claude figures out how to build it. Claude explores, plans, and implements.

But this autonomy still comes with a learning curve. Claude works within certain constraints you need to understand.

---

## The #1 Constraint: Context Management

**Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills.**

Claude's context window holds your entire conversation, including every message, every file Claude reads, and every command output. However, this can fill up fast. A single debugging session or codebase exploration might generate and consume tens of thousands of tokens.

This matters since LLM performance degrades as context fills. When the context window is getting full, Claude may start "forgetting" earlier instructions or making more mistakes. **The context window is the most important resource to manage.**

---

## Give Claude a Way to Verify Its Work

> **Include tests, screenshots, or expected outputs so Claude can check itself. This is the single highest-leverage thing you can do.**

Claude performs dramatically better when it can verify its own work—run tests, compare screenshots, and validate outputs.

Without clear success criteria, it might produce something that looks right but actually doesn't work. You become the only feedback loop, and every mistake requires your attention.

| Strategy | Before | After |
|----------|--------|-------|
| **Provide verification criteria** | "implement a function that validates email addresses" | "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing" |
| **Verify UI changes visually** | "make the dashboard look better" | "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them" |
| **Address root causes, not symptoms** | "the build is failing" | "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error" |

Your verification can also be a test suite, a linter, or a Bash command that checks output. **Invest in making your verification rock-solid.**

---

## Explore First, Then Plan, Then Code

> **Separate research and planning from implementation to avoid solving the wrong problem.**

Letting Claude jump straight to coding can produce code that solves the wrong problem. Use Plan Mode to separate exploration from execution.

The recommended workflow has four phases:

### 1. Explore
Enter Plan Mode. Claude reads files and answers questions without making changes.

```
read /src/auth and understand how we handle sessions and login.
also look at how we manage environment variables for secrets.
```

### 2. Plan
Ask Claude to create a detailed implementation plan.

```
I want to add Google OAuth. What files need to change?
What's the session flow? Create a plan.
```

Press `Ctrl+G` to open the plan in your text editor for direct editing before Claude proceeds.

### 3. Implement
Switch back to Normal Mode and let Claude code, verifying against its plan.

```
implement the OAuth flow from your plan. write tests for the
callback handler, run the test suite and fix any failures.
```

### 4. Commit
Ask Claude to commit with a descriptive message and create a PR.

```
commit with a descriptive message and open a PR
```

**Note:** Plan Mode is useful, but also adds overhead. For tasks where the scope is clear and the fix is small (like fixing a typo, adding a log line, or renaming a variable) ask Claude to do it directly. Planning is most useful when you're uncertain about the approach, when the change modifies multiple files, or when you're unfamiliar with the code being modified.

---

## Provide Specific Context in Your Prompts

> **The more precise your instructions, the fewer corrections you'll need.**

Claude can infer intent, but it can't read your mind. Reference specific files, mention constraints, and point to example patterns.

| Strategy | Before | After |
|----------|--------|-------|
| **Scope the task** | "add tests for foo.py" | "write a test for foo.py covering the edge case where the user is logged out. avoid mocks." |
| **Point to sources** | "why does ExecutionFactory have such a weird api?" | "look through ExecutionFactory's git history and summarize how its api came to be" |
| **Reference existing patterns** | "add a calendar widget" | "look at how existing widgets are implemented on the home page to understand the patterns. HotDogWidget.php is a good example. follow the pattern to implement a new calendar widget." |
| **Describe the symptom** | "fix the login bug" | "users report that login fails after session timeout. check the auth flow in src/auth/, especially token refresh. write a failing test that reproduces the issue, then fix it" |

Vague prompts can be useful when you're exploring and can afford to course-correct.

### Provide Rich Content

> **Use `@` to reference files, paste screenshots/images, or pipe data directly.**

You can provide rich data to Claude in several ways:

- **Reference files with `@`** instead of describing where code lives. Claude reads the file before responding.
- **Paste images directly**. Copy/paste or drag and drop images into the prompt.
- **Give URLs** for documentation and API references. Use `/permissions` to allowlist frequently-used domains.
- **Pipe in data** by running `cat error.log | claude` to send file contents directly.
- **Let Claude fetch what it needs**. Tell Claude to pull context itself using Bash commands, MCP tools, or by reading files.

---

## Configure Your Environment

A few setup steps make Claude Code significantly more effective across all your sessions.

### Write an Effective CLAUDE.md

> **Run `/init` to generate a starter CLAUDE.md file based on your current project structure, then refine over time.**

CLAUDE.md is a special file that Claude reads at the start of every conversation. Include Bash commands, code style, and workflow rules. This gives Claude persistent context **it can't infer from code alone**.

There's no required format for CLAUDE.md files, but keep it short and human-readable:

```markdown
# Code style
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible (eg. import { foo } from 'bar')

# Workflow
- Be sure to typecheck when you're done making a series of code changes
- Prefer running single tests, and not the whole test suite, for performance
```

Keep it concise. For each line, ask: *"Would removing this cause Claude to make mistakes?"* If not, cut it.

| ✅ Include | ❌ Exclude |
|-----------|-----------|
| Bash commands Claude can't guess | Anything Claude can figure out by reading code |
| Code style rules that differ from defaults | Standard language conventions Claude already knows |
| Testing instructions and preferred test runners | Detailed API documentation (link to docs instead) |
| Repository etiquette (branch naming, PR conventions) | Information that changes frequently |
| Architectural decisions specific to your project | Long explanations or tutorials |
| Developer environment quirks (required env vars) | File-by-file descriptions of the codebase |
| Common gotchas or non-obvious behaviors | Self-evident practices like "write clean code" |

### Configure Permissions

> **Use `/permissions` to allowlist safe commands or `/sandbox` for OS-level isolation.**

By default, Claude Code requests permission for actions that might modify your system. There are two ways to reduce these interruptions:

- **Permission allowlists**: Permit specific tools you know are safe (like `npm run lint` or `git commit`)
- **Sandboxing**: Enable OS-level isolation that restricts filesystem and network access

### Use CLI Tools

> **Tell Claude Code to use CLI tools like `gh`, `aws`, `gcloud`, and `sentry-cli` when interacting with external services.**

CLI tools are the most context-efficient way to interact with external services. If you use GitHub, install the `gh` CLI. Claude knows how to use it for creating issues, opening pull requests, and reading comments.

Claude is also effective at learning CLI tools it doesn't already know. Try prompts like `"Use 'foo-cli-tool --help' to learn about foo tool, then use it to solve A, B, C."`

### Connect MCP Servers

> **Run `claude mcp add` to connect external tools like Notion, Figma, or your database.**

With MCP servers, you can ask Claude to implement features from issue trackers, query databases, analyze monitoring data, integrate designs from Figma, and automate workflows.

### Set Up Hooks

> **Use hooks for actions that must happen every time with zero exceptions.**

Hooks run scripts automatically at specific points in Claude's workflow. Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens.

Claude can write hooks for you. Try prompts like *"Write a hook that runs eslint after every file edit"* or *"Write a hook that blocks writes to the migrations folder."*

### Create Skills

> **Create `SKILL.md` files in `.claude/skills/` to give Claude domain knowledge and reusable workflows.**

Skills extend Claude's knowledge with information specific to your project, team, or domain. Claude applies them automatically when relevant, or you can invoke them directly with `/skill-name`.

```markdown
# .claude/skills/api-conventions/SKILL.md
---
name: api-conventions
description: REST API design conventions for our services
---
# API Conventions
- Use kebab-case for URL paths
- Use camelCase for JSON properties
- Always include pagination for list endpoints
- Version APIs in the URL path (/v1/, /v2/)
```

### Create Custom Subagents

> **Define specialized assistants in `.claude/agents/` that Claude can delegate to for isolated tasks.**

Subagents run in their own context with their own set of allowed tools. They're useful for tasks that read many files or need specialized focus.

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: opus
---
You are a senior security engineer. Review code for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Secrets or credentials in code
- Insecure data handling

Provide specific line references and suggested fixes.
```

### Install Plugins

> **Run `/plugin` to browse the marketplace. Plugins add skills, tools, and integrations without configuration.**

Plugins bundle skills, hooks, subagents, and MCP servers into a single installable unit. If you work with a typed language, install a code intelligence plugin for precise symbol navigation.

---

## Communicate Effectively

The way you communicate with Claude Code significantly impacts the quality of results.

### Ask Codebase Questions

> **Ask Claude questions you'd ask a senior engineer.**

When onboarding to a new codebase, use Claude Code for learning and exploration:

- How does logging work?
- How do I make a new API endpoint?
- What does `async move { ... }` do on line 134 of `foo.rs`?
- What edge cases does `CustomerOnboardingFlowImpl` handle?
- Why does this code call `foo()` instead of `bar()` on line 333?

### Let Claude Interview You

> **For larger features, have Claude interview you first.**

Claude asks about things you might not have considered yet, including technical implementation, UI/UX, edge cases, and tradeoffs.

```
I want to build [brief description]. Interview me in detail using the AskUserQuestion tool.

Ask about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Don't ask obvious questions, dig into the hard parts I might not have considered.

Keep interviewing until we've covered everything, then write a complete spec to SPEC.md.
```

Once the spec is complete, start a fresh session to execute it.

---

## Manage Your Session

Conversations are persistent and reversible. Use this to your advantage!

### Course-Correct Early and Often

> **Correct Claude as soon as you notice it going off track.**

- **`Esc`**: Stop Claude mid-action. Context is preserved, so you can redirect.
- **`Esc + Esc` or `/rewind`**: Open the rewind menu and restore previous conversation and code state.
- **`"Undo that"`**: Have Claude revert its changes.
- **`/clear`**: Reset context between unrelated tasks.

If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run `/clear` and start fresh with a more specific prompt.

### Manage Context Aggressively

> **Run `/clear` between unrelated tasks to reset context.**

- Use `/clear` frequently between tasks
- When auto compaction triggers, Claude summarizes what matters most
- For more control, run `/compact <instructions>`
- Customize compaction behavior in CLAUDE.md

### Use Subagents for Investigation

> **Delegate research with `"use subagents to investigate X"`. They explore in a separate context, keeping your main conversation clean.**

```
Use subagents to investigate how our authentication system handles token
refresh, and whether we have any existing OAuth utilities I should reuse.
```

The subagent explores the codebase, reads relevant files, and reports back with findings—all without cluttering your main conversation.

### Rewind with Checkpoints

> **Every action Claude makes creates a checkpoint. You can restore conversation, code, or both.**

Claude automatically checkpoints before changes. Double-tap `Escape` or run `/rewind` to open the checkpoint menu.

### Resume Conversations

> **Run `claude --continue` to pick up where you left off, or `--resume` to choose from recent sessions.**

```bash
claude --continue    # Resume the most recent conversation
claude --resume      # Select from recent conversations
```

Use `/rename` to give sessions descriptive names so you can find them later.

---

## Automate and Scale

Once you're effective with one Claude, multiply your output with parallel sessions, headless mode, and fan-out patterns.

### Run Headless Mode

> **Use `claude -p "prompt"` in CI, pre-commit hooks, or scripts.**

```bash
# One-off queries
claude -p "Explain what this project does"

# Structured output for scripts
claude -p "List all API endpoints" --output-format json

# Streaming for real-time processing
claude -p "Analyze this log file" --output-format stream-json
```

### Run Multiple Claude Sessions

> **Run multiple Claude sessions in parallel to speed up development.**

There are two main ways to run parallel sessions:

- **Claude Desktop**: Manage multiple local sessions visually
- **Claude Code on the web**: Run on Anthropic's secure cloud infrastructure

Use a **Writer/Reviewer pattern**:

| Session A (Writer) | Session B (Reviewer) |
|-------------------|---------------------|
| `Implement a rate limiter for our API endpoints` | |
| | `Review the rate limiter implementation. Look for edge cases, race conditions, and consistency with our existing middleware patterns.` |
| `Here's the review feedback: [Session B output]. Address these issues.` | |

### Fan Out Across Files

> **Loop through tasks calling `claude -p` for each.**

For large migrations or analyses:

1. **Generate a task list** - Have Claude list all files that need migrating
2. **Write a script to loop through the list**
   ```bash
   for file in $(cat files.txt); do
     claude -p "Migrate $file from React to Vue. Return OK or FAIL." \
       --allowedTools "Edit,Bash(git commit *)"
   done
   ```
3. **Test on a few files, then run at scale**

---

## Avoid Common Failure Patterns

These are common mistakes. Recognizing them early saves time:

- **The kitchen sink session.** You start with one task, then ask Claude something unrelated, then go back to the first task.
  > **Fix**: `/clear` between unrelated tasks.

- **Correcting over and over.** Claude does something wrong, you correct it, it's still wrong, you correct again.
  > **Fix**: After two failed corrections, `/clear` and write a better initial prompt.

- **The over-specified CLAUDE.md.** If your CLAUDE.md is too long, Claude ignores half of it.
  > **Fix**: Ruthlessly prune. Convert to hooks where possible.

- **The trust-then-verify gap.** Claude produces a plausible-looking implementation that doesn't handle edge cases.
  > **Fix**: Always provide verification (tests, scripts, screenshots).

- **The infinite exploration.** You ask Claude to "investigate" something without scoping it.
  > **Fix**: Scope investigations narrowly or use subagents.

---

## Develop Your Intuition

The patterns in this guide aren't set in stone. They're starting points that work well in general, but might not be optimal for every situation.

Pay attention to what works. When Claude produces great output, notice what you did: the prompt structure, the context you provided, the mode you were in. When Claude struggles, ask why.

Over time, you'll develop intuition that no guide can capture. You'll know when to be specific and when to be open-ended, when to plan and when to explore, when to clear context and when to let it accumulate.

---

## Related Resources

- **[How Claude Code Works](./official-how-claude-code-works.md)** - Understand the agentic loop, tools, and context management
- **[Extend Claude Code](./official-features-overview.md)** - Choose between skills, hooks, MCP, subagents, and plugins
- **[Common Workflows](./official-common-workflows.md)** - Step-by-step recipes for debugging, testing, PRs, and more

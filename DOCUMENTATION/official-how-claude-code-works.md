# How Claude Code Works

> **Source:** https://code.claude.com/docs/en/how-claude-code-works
>
> Understand the agentic loop, built-in tools, and how Claude Code interacts with your project.

Claude Code is an agentic assistant that runs in your terminal. While it excels at coding, it can help with anything you can do from the command line: writing docs, running builds, searching files, researching topics, and more.

This guide covers the core architecture, built-in capabilities, and tips for working effectively. For step-by-step walkthroughs, see [Common Workflows](./official-common-workflows.md). For extensibility features like skills, MCP, and hooks, see [Extend Claude Code](./official-features-overview.md).

---

## The Agentic Loop

When you give Claude a task, it works through three phases: **gather context**, **take action**, and **verify results**. These phases blend together. Claude uses tools throughout, whether searching files to understand your code, editing to make changes, or running tests to check its work.

The loop adapts to what you ask:
- A question about your codebase might only need context gathering
- A bug fix cycles through all three phases repeatedly
- A refactor might involve extensive verification

Claude decides what each step requires based on what it learned from the previous step, chaining dozens of actions together and course-correcting along the way.

**You're part of this loop too.** You can interrupt at any point to steer Claude in a different direction, provide additional context, or ask it to try a different approach. Claude works autonomously but stays responsive to your input.

The agentic loop is powered by two components: **models** that reason and **tools** that act. Claude Code serves as the **agentic harness** around Claude: it provides the tools, context management, and execution environment that turn a language model into a capable coding agent.

### Models

Claude Code uses Claude models to understand your code and reason about tasks. Claude can read code in any language, understand how components connect, and figure out what needs to change to accomplish your goal. For complex tasks, it breaks work into steps, executes them, and adjusts based on what it learns.

Multiple models are available with different tradeoffs:
- **Sonnet** handles most coding tasks well
- **Opus** provides stronger reasoning for complex architectural decisions

Switch with `/model` during a session or start with `claude --model <name>`.

### Tools

Tools are what make Claude Code agentic. Without tools, Claude can only respond with text. With tools, Claude can act: read your code, edit files, run commands, search the web, and interact with external services. Each tool use returns information that feeds back into the loop, informing Claude's next decision.

The built-in tools generally fall into four categories:

| Category | What Claude can do |
|----------|-------------------|
| **File operations** | Read files, edit code, create new files, rename and reorganize |
| **Search** | Find files by pattern, search content with regex, explore codebases |
| **Execution** | Run shell commands, start servers, run tests, use git |
| **Web** | Search the web, fetch documentation, look up error messages |
| **Code intelligence** | See type errors and warnings after edits, jump to definitions, find references (requires code intelligence plugins) |

Claude chooses which tools to use based on your prompt and what it learns along the way. When you say "fix the failing tests," Claude might:

1. Run the test suite to see what's failing
2. Read the error output
3. Search for the relevant source files
4. Read those files to understand the code
5. Edit the files to fix the issue
6. Run the tests again to verify

**Extending the base capabilities:** The built-in tools are the foundation. You can extend what Claude knows with skills, connect to external services with MCP, automate workflows with hooks, and offload tasks to subagents.

---

## What Claude Can Access

When you run `claude` in a directory, Claude Code gains access to:

- **Your project.** Files in your directory and subdirectories, plus files elsewhere with your permission.
- **Your terminal.** Any command you could run: build tools, git, package managers, system utilities, scripts.
- **Your git state.** Current branch, uncommitted changes, and recent commit history.
- **Your CLAUDE.md.** A markdown file where you store project-specific instructions, conventions, and context.
- **Extensions you configure.** MCP servers for external services, skills for workflows, subagents for delegated work.

Because Claude sees your whole project, it can work across it. When you ask Claude to "fix the authentication bug," it searches for relevant files, reads multiple files to understand context, makes coordinated edits across them, runs tests to verify the fix, and commits the changes if you ask.

---

## Work with Sessions

Claude Code saves your conversation locally as you work. Each message, tool use, and result is stored, which enables rewinding, resuming, and forking sessions. Before Claude makes code changes, it also snapshots the affected files so you can revert if needed.

**Sessions are ephemeral.** Unlike claude.ai, Claude Code has no persistent memory between sessions. Each new session starts fresh. Claude doesn't "learn" your preferences over time or remember what you worked on last week. If you want Claude to know something across sessions, put it in your CLAUDE.md.

### Work Across Branches

Each Claude Code conversation is a session tied to your current directory. When you resume, you only see sessions from that directory.

Claude sees your current branch's files. When you switch branches, Claude sees the new branch's files, but your conversation history stays the same.

Since sessions are tied to directories, you can run parallel Claude sessions by using **git worktrees**, which create separate directories for individual branches.

### Resume or Fork Sessions

When you resume a session with `claude --continue` or `claude --resume`, you pick up where you left off using the same session ID. New messages append to the existing conversation.

To branch off and try a different approach without affecting the original session, use the `--fork-session` flag:

```bash
claude --continue --fork-session
```

This creates a new session ID while preserving the conversation history up to that point.

### The Context Window

Claude's context window holds your conversation history, file contents, command outputs, CLAUDE.md, loaded skills, and system instructions. As you work, context fills up. Claude compacts automatically, but instructions from early in the conversation can get lost.

**Put persistent rules in CLAUDE.md**, and run `/context` to see what's using space.

#### When Context Fills Up

Claude Code manages context automatically as you approach the limit. It clears older tool outputs first, then summarizes the conversation if needed. Your requests and key code snippets are preserved; detailed instructions from early in the conversation may be lost.

To control what's preserved during compaction:
- Add a "Compact Instructions" section to CLAUDE.md
- Run `/compact` with a focus (like `/compact focus on the API changes`)
- Run `/context` to see what's using space

#### Manage Context with Skills and Subagents

**Skills** load on demand. Claude sees skill descriptions at session start, but the full content only loads when a skill is used. For skills you invoke manually, set `disable-model-invocation: true` to keep descriptions out of context until you need them.

**Subagents** get their own fresh context, completely separate from your main conversation. Their work doesn't bloat your context. When done, they return a summary.

---

## Stay Safe with Checkpoints and Permissions

Claude has two safety mechanisms: checkpoints let you undo file changes, and permissions control what Claude can do without asking.

### Undo Changes with Checkpoints

**Every file edit is reversible.** Before Claude edits any file, it snapshots the current contents. If something goes wrong, press `Esc` twice to rewind to a previous state, or ask Claude to undo.

Checkpoints are local to your session, separate from git. They only cover file changes. Actions that affect remote systems (databases, APIs, deployments) can't be checkpointed.

### Control What Claude Can Do

Press `Shift+Tab` to cycle through permission modes:

- **Default**: Claude asks before file edits and shell commands
- **Auto-accept edits**: Claude edits files without asking, still asks for commands
- **Plan mode**: Claude uses read-only tools only, creating a plan you can approve before execution

You can also allow specific commands in `.claude/settings.json` so Claude doesn't ask each time.

---

## Work Effectively with Claude Code

### Ask Claude Code for Help

Claude Code can teach you how to use it. Ask questions like "how do I set up hooks?" or "what's the best way to structure my CLAUDE.md?" and Claude will explain.

Built-in commands also guide you through setup:
- `/init` walks you through creating a CLAUDE.md for your project
- `/agents` helps you configure custom subagents
- `/doctor` diagnoses common issues with your installation

### It's a Conversation

Claude Code is conversational. You don't need perfect prompts. Start with what you want, then refine:

```
> Fix the login bug

[Claude investigates, tries something]

> That's not quite right. The issue is in the session handling.

[Claude adjusts approach]
```

When the first attempt isn't right, you don't start over. You iterate.

#### Interrupt and Steer

You can interrupt Claude at any point. If it's going down the wrong path, just type your correction and press Enter. Claude will stop what it's doing and adjust its approach based on your input.

### Be Specific Upfront

The more precise your initial prompt, the fewer corrections you'll need. Reference specific files, mention constraints, and point to example patterns.

```
> The checkout flow is broken for users with expired cards.
> Check src/payments/ for the issue, especially token refresh.
> Write a failing test first, then fix it.
```

### Give Claude Something to Verify Against

Claude performs better when it can check its own work. Include test cases, paste screenshots of expected UI, or define the output you want.

```
> Implement validateEmail. Test cases: 'user@example.com' → true,
> 'invalid' → false, 'user@.com' → false. Run the tests after.
```

### Explore Before Implementing

For complex problems, separate research from coding. Use plan mode (`Shift+Tab` twice) to analyze the codebase first:

```
> Read src/auth/ and understand how we handle sessions.
> Then create a plan for adding OAuth support.
```

Review the plan, refine it through conversation, then let Claude implement.

### Delegate, Don't Dictate

Think of delegating to a capable colleague. Give context and direction, then trust Claude to figure out the details:

```
> The checkout flow is broken for users with expired cards.
> The relevant code is in src/payments/. Can you investigate and fix it?
```

You don't need to specify which files to read or what commands to run. Claude figures that out.

---

## What's Next

- **[Extend with Features](./official-features-overview.md)** - Add Skills, MCP connections, and custom commands
- **[Common Workflows](./official-common-workflows.md)** - Step-by-step guides for typical tasks

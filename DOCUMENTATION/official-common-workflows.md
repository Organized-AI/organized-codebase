# Common Workflows

> **Source:** https://code.claude.com/docs/en/common-workflows
>
> Step-by-step guides for exploring codebases, fixing bugs, refactoring, testing, and other everyday tasks with Claude Code.

This page covers practical workflows for everyday development: exploring unfamiliar code, debugging, refactoring, writing tests, creating PRs, and managing sessions. Each section includes example prompts you can adapt to your own projects. For higher-level patterns and tips, see [Best Practices](./official-best-practices.md).

---

## Understand New Codebases

### Get a Quick Codebase Overview

Suppose you've just joined a new project and need to understand its structure quickly.

1. **Navigate to the project root directory**
   ```bash
   cd /path/to/project
   ```

2. **Start Claude Code**
   ```bash
   claude
   ```

3. **Ask for a high-level overview**
   ```
   > give me an overview of this codebase
   ```

4. **Dive deeper into specific components**
   ```
   > explain the main architecture patterns used here
   > what are the key data models?
   > how is authentication handled?
   ```

**Tips:**
- Start with broad questions, then narrow down to specific areas
- Ask about coding conventions and patterns used in the project
- Request a glossary of project-specific terms

### Find Relevant Code

Suppose you need to locate code related to a specific feature or functionality.

1. **Ask Claude to find relevant files**
   ```
   > find the files that handle user authentication
   ```

2. **Get context on how components interact**
   ```
   > how do these authentication files work together?
   ```

3. **Understand the execution flow**
   ```
   > trace the login process from front-end to database
   ```

**Tips:**
- Be specific about what you're looking for
- Use domain language from the project
- Install a code intelligence plugin for your language

---

## Fix Bugs Efficiently

Suppose you've encountered an error message and need to find and fix its source.

1. **Share the error with Claude**
   ```
   > I'm seeing an error when I run npm test
   ```

2. **Ask for fix recommendations**
   ```
   > suggest a few ways to fix the @ts-ignore in user.ts
   ```

3. **Apply the fix**
   ```
   > update user.ts to add the null check you suggested
   ```

**Tips:**
- Tell Claude the command to reproduce the issue and get a stack trace
- Mention any steps to reproduce the error
- Let Claude know if the error is intermittent or consistent

---

## Refactor Code

Suppose you need to update old code to use modern patterns and practices.

1. **Identify legacy code for refactoring**
   ```
   > find deprecated API usage in our codebase
   ```

2. **Get refactoring recommendations**
   ```
   > suggest how to refactor utils.js to use modern JavaScript features
   ```

3. **Apply the changes safely**
   ```
   > refactor utils.js to use ES2024 features while maintaining the same behavior
   ```

4. **Verify the refactoring**
   ```
   > run tests for the refactored code
   ```

**Tips:**
- Ask Claude to explain the benefits of the modern approach
- Request that changes maintain backward compatibility when needed
- Do refactoring in small, testable increments

---

## Use Specialized Subagents

Suppose you want to use specialized AI subagents to handle specific tasks more effectively.

1. **View available subagents**
   ```
   > /agents
   ```
   This shows all available subagents and lets you create new ones.

2. **Use subagents automatically**
   Claude Code automatically delegates appropriate tasks to specialized subagents:
   ```
   > review my recent code changes for security issues
   > run all tests and fix any failures
   ```

3. **Explicitly request specific subagents**
   ```
   > use the code-reviewer subagent to check the auth module
   > have the debugger subagent investigate why users can't log in
   ```

4. **Create custom subagents for your workflow**
   Run `/agents`, then select "Create New subagent" and follow the prompts to define:
   - A unique identifier that describes the subagent's purpose
   - When Claude should use this agent
   - Which tools it can access
   - A system prompt describing the agent's role and behavior

**Tips:**
- Create project-specific subagents in `.claude/agents/` for team sharing
- Use descriptive `description` fields to enable automatic delegation
- Limit tool access to what each subagent actually needs

---

## Use Plan Mode for Safe Code Analysis

Plan Mode instructs Claude to create a plan by analyzing the codebase with read-only operations, perfect for exploring codebases, planning complex changes, or reviewing code safely.

### When to Use Plan Mode

- **Multi-step implementation**: When your feature requires making edits to many files
- **Code exploration**: When you want to research the codebase thoroughly before changing anything
- **Interactive development**: When you want to iterate on the direction with Claude

### How to Use Plan Mode

**Turn on Plan Mode during a session:**
Use **Shift+Tab** to cycle through permission modes. A subsequent Shift+Tab will switch into Plan Mode, indicated by `⏸ plan mode on`.

**Start a new session in Plan Mode:**
```bash
claude --permission-mode plan
```

**Run "headless" queries in Plan Mode:**
```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### Example: Planning a Complex Refactor

```bash
claude --permission-mode plan
```

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

Claude analyzes the current implementation and creates a comprehensive plan. Refine with follow-ups:

```
> What about backward compatibility?
> How should we handle database migration?
```

**Tip:** Press `Ctrl+G` to open the plan in your default text editor, where you can edit it directly before Claude proceeds.

### Configure Plan Mode as Default

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

---

## Work with Tests

Suppose you need to add tests for uncovered code.

1. **Identify untested code**
   ```
   > find functions in NotificationsService.swift that are not covered by tests
   ```

2. **Generate test scaffolding**
   ```
   > add tests for the notification service
   ```

3. **Add meaningful test cases**
   ```
   > add test cases for edge conditions in the notification service
   ```

4. **Run and verify tests**
   ```
   > run the new tests and fix any failures
   ```

Claude can generate tests that follow your project's existing patterns and conventions. When asking for tests, be specific about what behavior you want to verify.

---

## Create Pull Requests

You can create pull requests by asking Claude directly ("create a pr for my changes") or by using the `/commit-push-pr` skill.

```
> /commit-push-pr
```

For more control, guide Claude through it step-by-step:

1. **Summarize your changes**
   ```
   > summarize the changes I've made to the authentication module
   ```

2. **Generate a pull request**
   ```
   > create a pr
   ```

3. **Review and refine**
   ```
   > enhance the PR description with more context about the security improvements
   ```

**Tip:** Review Claude's generated PR before submitting and ask Claude to highlight potential risks or considerations.

---

## Handle Documentation

Suppose you need to add or update documentation for your code.

1. **Identify undocumented code**
   ```
   > find functions without proper JSDoc comments in the auth module
   ```

2. **Generate documentation**
   ```
   > add JSDoc comments to the undocumented functions in auth.js
   ```

3. **Review and enhance**
   ```
   > improve the generated documentation with more context and examples
   ```

4. **Verify documentation**
   ```
   > check if the documentation follows our project standards
   ```

**Tips:**
- Specify the documentation style you want (JSDoc, docstrings, etc.)
- Ask for examples in the documentation
- Request documentation for public APIs, interfaces, and complex logic

---

## Work with Images

Suppose you need to work with images in your codebase, and you want Claude's help analyzing image content.

1. **Add an image to the conversation**
   - Drag and drop an image into the Claude Code window
   - Copy an image and paste it into the CLI with `ctrl+v`
   - Provide an image path to Claude: "Analyze this image: /path/to/your/image.png"

2. **Ask Claude to analyze the image**
   ```
   > What does this image show?
   > Describe the UI elements in this screenshot
   > Are there any problematic elements in this diagram?
   ```

3. **Use images for context**
   ```
   > Here's a screenshot of the error. What's causing it?
   > This is our current database schema. How should we modify it for the new feature?
   ```

4. **Get code suggestions from visual content**
   ```
   > Generate CSS to match this design mockup
   > What HTML structure would recreate this component?
   ```

---

## Reference Files and Directories

Use `@` to quickly include files or directories without waiting for Claude to read them.

**Reference a single file:**
```
> Explain the logic in @src/utils/auth.js
```

**Reference a directory:**
```
> What's the structure of @src/components?
```

**Reference MCP resources:**
```
> Show me the data from @github:repos/owner/repo/issues
```

**Tips:**
- File paths can be relative or absolute
- `@` file references add CLAUDE.md in the file's directory and parent directories to context
- Directory references show file listings, not contents
- You can reference multiple files in a single message

---

## Use Extended Thinking (Thinking Mode)

Extended thinking is enabled by default, reserving a portion of the output token budget (up to 31,999 tokens) for Claude to reason through complex problems step-by-step.

Extended thinking is particularly valuable for:
- Complex architectural decisions
- Challenging bugs
- Multi-step implementation planning
- Evaluating tradeoffs between different approaches

### Configure Thinking Mode

| Scope | How to configure |
|-------|------------------|
| **Toggle shortcut** | Press `Option+T` (macOS) or `Alt+T` (Windows/Linux) |
| **Global default** | Use `/config` to toggle thinking mode |
| **Limit token budget** | Set `MAX_THINKING_TOKENS` environment variable |

To view Claude's thinking process, press `Ctrl+O` to toggle verbose mode.

---

## Resume Previous Conversations

When starting Claude Code, you can resume a previous session:

- `claude --continue` continues the most recent conversation in the current directory
- `claude --resume` opens a conversation picker or resumes by name

From inside an active session, use `/resume` to switch to a different conversation.

### Name Your Sessions

Give sessions descriptive names to find them later:

**Name the current session:**
```
> /rename auth-refactor
```

**Resume by name later:**
```bash
claude --resume auth-refactor
```

### Use the Session Picker

The `/resume` command opens an interactive session picker:

| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate between sessions |
| `→` / `←` | Expand or collapse grouped sessions |
| `Enter` | Select and resume the highlighted session |
| `P` | Preview the session content |
| `R` | Rename the highlighted session |
| `/` | Search to filter sessions |
| `A` | Toggle between current directory and all projects |
| `B` | Filter to sessions from your current git branch |
| `Esc` | Exit the picker or search mode |

---

## Run Parallel Claude Code Sessions with Git Worktrees

Suppose you need to work on multiple tasks simultaneously with complete code isolation between Claude Code instances.

1. **Create a new worktree**
   ```bash
   # Create a new worktree with a new branch
   git worktree add ../project-feature-a -b feature-a

   # Or create a worktree with an existing branch
   git worktree add ../project-bugfix bugfix-123
   ```

2. **Run Claude Code in each worktree**
   ```bash
   cd ../project-feature-a
   claude
   ```

3. **Manage your worktrees**
   ```bash
   # List all worktrees
   git worktree list

   # Remove a worktree when done
   git worktree remove ../project-feature-a
   ```

**Tips:**
- Each worktree has its own independent file state
- Changes made in one worktree won't affect others
- For long-running tasks, you can have Claude working in one worktree while you continue development in another

---

## Use Claude as a Unix-Style Utility

### Add Claude to Your Verification Process

**Add Claude to your build script:**
```json
// package.json
{
    "scripts": {
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

### Pipe In, Pipe Out

**Pipe data through Claude:**
```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

### Control Output Format

**Use text format (default):**
```bash
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

**Use JSON format:**
```bash
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

**Use streaming JSON format:**
```bash
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

---

## Ask Claude About Its Capabilities

Claude has built-in access to its documentation and can answer questions about its own features and limitations.

### Example Questions

```
> can Claude Code create pull requests?
> how does Claude Code handle permissions?
> what skills are available?
> how do I use MCP with Claude Code?
> how do I configure Claude Code for Amazon Bedrock?
> what are the limitations of Claude Code?
```

**Tips:**
- Claude always has access to the latest Claude Code documentation
- Ask specific questions to get detailed answers
- Claude can explain complex features like MCP integration, enterprise configurations, and advanced workflows

---

## What's Next

- **[Best Practices](./official-best-practices.md)** - Patterns for getting the most out of Claude Code
- **[How Claude Code Works](./official-how-claude-code-works.md)** - Understand the agentic loop and context management
- **[Extend Claude Code](./official-features-overview.md)** - Add skills, hooks, MCP, subagents, and plugins

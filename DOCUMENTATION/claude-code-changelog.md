---
title: Claude Code Changelog
source: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
fetched_at: 2025-01-28T14:05:00.000Z
latest_version: 2.1.22
total_versions: 45+
actor: apify/rag-web-browser + web_fetch
generated_by: organized-codebase/changelog-tracker
---

# Claude Code Changelog

> **Last Updated:** January 28, 2025  
> **Source:** [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)  
> **Latest Version:** 2.1.22  
> **Fetched via:** Apify RAG Web Browser + Web Fetch

---

## 2.1.22 (Latest)

- Fixed structured outputs for non-interactive (-p) mode

---

## 2.1.21

### Added
- Support for full-width (zenkaku) number input from Japanese IME in option selection prompts
- [VSCode] Automatic Python virtual environment activation, ensuring `python` and `pip` commands use the correct interpreter (configurable via `claudeCode.usePythonEnvironment` setting)

### Fixed
- Shell completion cache files being truncated on exit
- API errors when resuming sessions that were interrupted during tool execution
- Auto-compact triggering too early on models with large output token limits
- Task IDs potentially being reused after deletion
- File search not working in VS Code extension on Windows
- [VSCode] Message action buttons having incorrect background colors

### Improved
- Read/search progress indicators to show "Reading…" while in progress and "Read" when complete
- Claude to prefer file operation tools (Read, Edit, Write) over bash equivalents (cat, sed, awk)

---

## 2.1.20

### Added
- Arrow key history navigation in vim normal mode when cursor cannot move further
- External editor shortcut (Ctrl+G) to the help menu for better discoverability
- PR review status indicator to the prompt footer, showing the current branch's PR state (approved, changes requested, pending, or draft) as a colored dot with a clickable link
- Support for loading `CLAUDE.md` files from additional directories specified via `--add-dir` flag (requires setting `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1`)
- Ability to delete tasks via the `TaskUpdate` tool
- Customizable keyboard shortcuts. Configure keybindings per context, create chord sequences, and personalize your workflow. Run `/keybindings` to get started

### Fixed
- Session compaction issues that could cause resume to load full history instead of the compact summary
- Agents sometimes ignoring user messages sent while actively working on a task
- Wide character (emoji, CJK) rendering artifacts where trailing columns were not cleared when replaced by narrower characters
- JSON parsing errors when MCP tool responses contain special Unicode characters
- Up/down arrow keys in multi-line and wrapped text input to prioritize cursor movement over history navigation
- Draft prompt being lost when pressing UP arrow to navigate command history
- Ghost text flickering when typing slash commands mid-input
- Dangling Claude Code processes when terminal is closed by catching EIO errors from `process.exit()` and using SIGKILL as fallback
- `/rename` and `/tag` not updating the correct session when resuming from a different directory (e.g., git worktrees)

---

## 2.1.19

### Added
- Env var `CLAUDE_CODE_ENABLE_TASKS`, set to false to keep the old system temporarily
- Shorthand `$0`, `$1`, etc. for accessing individual arguments in custom commands

### Fixed
- Crashes on processors without AVX instruction support
- Resuming sessions by custom title not working when run from a different directory
- Pasted text content being lost when using prompt stash (Ctrl+S) and restore
- Agent list displaying "Sonnet (default)" instead of "Inherit (default)" for agents without an explicit model setting
- Backgrounded hook commands not returning early, potentially causing the session to wait on a process that was intentionally backgrounded

---

## 2.1.18

### Added
- `/teleport` and `/remote-env` slash commands for claude.ai subscribers, allowing them to resume and configure remote sessions
- Support for disabling specific agents using `Task(AgentName)` syntax in settings.json permissions or the `--disallowedTools` CLI flag
- Hooks support to agent frontmatter, allowing agents to define PreToolUse, PostToolUse, and Stop hooks scoped to the agent's lifecycle
- New Vim motions: `;` and `,` to repeat f/F/t/T motions, `y` operator for yank with `yy`/`Y`, `p`/`P` for paste, text objects (`iw`, `aw`, `iW`, `aW`, `i"`, `a"`, `i'`, `a'`, `i(`, `a(`, `i[`, `a[`, `i{`, `a{`), `>>` and `<<` for indent/dedent, and `J` to join lines
- Slash command autocomplete support when `/` appears anywhere in input, not just at the beginning
- `--tools` flag support in interactive mode to restrict which built-in tools Claude can use during interactive sessions

---

## 2.1.17

### Added
- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable to override the default file read token limit
- Support for YAML-style lists in frontmatter `allowed-tools` field for cleaner skill declarations
- Support for prompt and agent hook types from plugins (previously only command hooks were supported)
- Cmd+V support for image paste in iTerm2 (maps to Ctrl+V)
- Left/right arrow key navigation for cycling through tabs in dialogs
- Real-time thinking block display in Ctrl+O transcript mode
- Filepath to full output in background bash task details dialog
- Skills as a separate category in the context visualization

### Fixed
- OAuth token refresh not triggering when server reports token expired but local expiration check disagrees
- Session persistence getting stuck after transient server errors by recovering from 409 conflicts when the entry was actually stored

### Improved
- Terminal rendering performance when using native installer or Bun, especially for text with emoji, ANSI codes, and Unicode characters
- Performance when reading Jupyter notebooks with many cells
- Reliability for piped input like `cat refactor.md | claude`
- Claude to automatically continue when response is cut off due to output token limit
- Subagents (Task tool) to continue working after permission denial
- Skills to show progress while executing, displaying tool uses as they happen
- Skills from `/skills/` directories to be visible in the slash command menu by default

---

## 2.1.16

### Added
- Claude in Chrome (Beta) feature that works with the Chrome extension (https://claude.ai/chrome) to let you control your browser directly from Claude Code
- Wildcard syntax `mcp__server__*` for MCP tool permissions to allow or deny all tools from a server
- Auto-update toggle for plugin marketplaces, allowing per-marketplace control over automatic updates
- `current_usage` field to status line input, enabling accurate context window percentage calculations
- Enter key to accept and submit prompt suggestions immediately (tab still accepts for editing)

### Fixed
- Permission rules incorrectly rejecting valid bash commands containing shell glob patterns (e.g., `ls *.txt`, `for f in *.png`)
- Input being cleared when processing queued commands while the user was typing
- Prompt suggestions replacing typed input when pressing Tab

### Changed
- Bedrock: Environment variable `ANTHROPIC_BEDROCK_BASE_URL` is now respected for token counting and inference profile listing

---

## 2.1.15

### Removed
- `#` shortcut for quick memory entry (tell Claude to edit your CLAUDE.md instead)

### Fixed
- Thinking mode toggle in `/config` not persisting correctly
- IME (Input Method Editor) support for languages like Chinese, Japanese, and Korean by correctly positioning the composition window at the cursor
- A bug where disallowed MCP tools were visible to the model
- An issue where steering messages could be lost while a subagent is working
- Option+Arrow word navigation treating entire CJK text sequences as a single word

### Improved
- Plan mode exit UX: show simplified yes/no dialog when exiting with empty or missing plan

### Added
- Support for enterprise managed settings. Contact your Anthropic account team to enable this feature
- Thinking mode is now enabled by default for Opus 4.5

---

## 2.1.14

### Changed
- Ctrl+Z to suspend Claude Code. Resume by running `fg`. Prompt input undo is now Ctrl+U
- Teammate messages to render with rich Markdown formatting (bold, code blocks, lists, etc.) instead of plain text
- ToolSearch results to appear as a brief notification instead of inline in the conversation
- The `/commit-push-pr` skill to automatically post PR URLs to Slack channels when configured via MCP tools
- The `/copy` command to be available to all users
- Background agents to prompt for tool permissions before launching
- Permission rules like `Bash(*)` to be accepted and treated as equivalent to `Bash`
- Config backups to be timestamped and rotated (keeping 5 most recent) to prevent data loss

### Fixed
- A bug where the theme selector was saving excessively

### Added
- Tilde (~) expansion support to `/add-dir` command
- Hooks: EPIPE system error handling
- Hooks: Split Stop hook triggering into Stop and SubagentStop
- Hooks: Optional timeout configuration for each command
- Hooks: "hook_event_name" to hook input

---

## 2.1.13

### Added
- `/resume` slash command to switch conversations within Claude Code
- TypeScript SDK: `import @anthropic-ai/claude-code` to get started
- Python SDK: `pip install claude-code-sdk` to get started
- `--add-dir` CLI argument for specifying additional working directories
- Streaming input support without requiring `-p` flag

### Improved
- Slash commands: moved "project" and "user" prefixes to descriptions
- Slash commands: improved reliability for command discovery
- Support for Ghostty
- Web search reliability
- `/mcp` output
- Editing of files with tab-based indentation

### Fixed
- Settings arrays got overwritten instead of merged
- Tool_use without matching tool_result errors
- A bug where stdio MCP server processes would linger after quitting Claude Code

---

## 2.1.12 and Earlier

### Plugin System Released
- Extend Claude Code with custom commands, agents, hooks, and MCP servers from marketplaces
- `/plugin install`, `/plugin enable/disable`, `/plugin marketplace` commands for plugin management
- Repository-level plugin configuration via `extraKnownMarketplaces` for team collaboration
- `/plugin validate` command for validating plugin structure and configuration

### Key Features
- Ask permissions: have Claude Code always ask for confirmation to use specific tools with `/permissions`
- Background commands: (Ctrl-b) to run any Bash command in the background
- Customizable status line: add your terminal prompt to Claude Code with `/statusline`
- Enhanced `/doctor` command with CLAUDE.md and MCP tool context for self-serve debugging

### Windows Support
- Fixed native file search, ripgrep, and subagent functionality
- Improved permissions checks for allow/deny tools and project trust
- Improved sub-process spawning to eliminate "No such file or directory" errors

---

## Notes

For the complete changelog with all versions, visit:
https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md

For release downloads, visit:
https://github.com/anthropics/claude-code/releases

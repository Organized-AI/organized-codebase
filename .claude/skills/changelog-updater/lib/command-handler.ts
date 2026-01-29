/**
 * Command Demo Handler (feat-007)
 *
 * Allows users to try new commands directly from the update flow.
 * Provides command explanations and optional execution.
 */

import type { ParsedEntry } from './entry-parser';
import type { ActionHandler, ActionResult } from './action-router';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CommandInfo {
  command: string;
  description: string;
  isSlashCommand: boolean;
  isShortcut: boolean;
  isCliFlag: boolean;
  example?: string;
  documentation?: string;
}

export interface CommandDemoResult {
  command: string;
  executed: boolean;
  output?: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command Extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract command info from a parsed entry
 */
export function extractCommandInfo(entry: ParsedEntry): CommandInfo[] {
  const commands: CommandInfo[] = [];
  const details = entry.extractedDetails;
  const content = entry.original.content;

  // Slash commands
  if (details.commands) {
    for (const cmd of details.commands) {
      commands.push({
        command: cmd,
        description: extractDescriptionForCommand(cmd, content),
        isSlashCommand: true,
        isShortcut: false,
        isCliFlag: false,
        example: cmd,
      });
    }
  }

  // Keyboard shortcuts
  if (details.shortcuts) {
    for (const shortcut of details.shortcuts) {
      commands.push({
        command: shortcut,
        description: extractDescriptionForCommand(shortcut, content),
        isSlashCommand: false,
        isShortcut: true,
        isCliFlag: false,
      });
    }
  }

  // CLI flags
  if (details.flags) {
    for (const flag of details.flags) {
      commands.push({
        command: flag,
        description: extractDescriptionForCommand(flag, content),
        isSlashCommand: false,
        isShortcut: false,
        isCliFlag: true,
        example: `claude ${flag}`,
      });
    }
  }

  return commands;
}

/**
 * Extract a description for a specific command from content
 */
function extractDescriptionForCommand(command: string, content: string): string {
  // Try to find text after the command
  const escapedCmd = command.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`${escapedCmd}[^\`]*?[-–—]\\s*([^.]+)`, 'i');
  const match = content.match(pattern);

  if (match) {
    return match[1].trim();
  }

  // Try to find text after backticks containing the command
  const btPattern = new RegExp(`\`${escapedCmd}\`[^.]*?([A-Z][^.]+)`, 'i');
  const btMatch = content.match(btPattern);

  if (btMatch) {
    return btMatch[1].trim();
  }

  // Fall back to generic description
  if (command.startsWith('/')) {
    return `Execute the ${command} slash command`;
  }
  if (command.includes('+')) {
    return `Use the ${command} keyboard shortcut`;
  }
  if (command.startsWith('--')) {
    return `Use the ${command} CLI flag`;
  }

  return `Try the ${command} feature`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command Documentation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Known slash commands with documentation
 */
const KNOWN_COMMANDS: Record<string, { description: string; example: string; docs?: string }> = {
  '/teleport': {
    description: 'Resume a Claude Code session that was started on claude.ai',
    example: '/teleport',
    docs: 'Requires a claude.ai subscription. Allows continuing cloud sessions locally.',
  },
  '/remote-env': {
    description: 'Configure environment variables for remote sessions',
    example: '/remote-env',
  },
  '/keybindings': {
    description: 'Customize keyboard shortcuts',
    example: '/keybindings',
    docs: 'Opens the keybindings editor to configure shortcuts per context.',
  },
  '/tasks': {
    description: 'View and manage the task list',
    example: '/tasks',
    docs: 'Part of the new Task system that replaced TodoWrite.',
  },
  '/rename': {
    description: 'Rename the current session',
    example: '/rename "my session"',
  },
  '/tag': {
    description: 'Add tags to the current session',
    example: '/tag feature bugfix',
  },
  '/help': {
    description: 'Show available commands and help',
    example: '/help',
  },
  '/clear': {
    description: 'Clear the conversation history',
    example: '/clear',
  },
};

/**
 * Get documentation for a command
 */
export function getCommandDocumentation(command: string): string | null {
  const known = KNOWN_COMMANDS[command];
  if (known) {
    let doc = `**${command}**\n\n${known.description}\n\nExample: \`${known.example}\``;
    if (known.docs) {
      doc += `\n\n${known.docs}`;
    }
    return doc;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command Preview
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a preview of what the command does
 */
export function generateCommandPreview(info: CommandInfo): string {
  const lines: string[] = [];

  if (info.isSlashCommand) {
    lines.push(`📋 Slash Command: \`${info.command}\``);
  } else if (info.isShortcut) {
    lines.push(`⌨️ Keyboard Shortcut: \`${info.command}\``);
  } else if (info.isCliFlag) {
    lines.push(`🖥️ CLI Flag: \`${info.command}\``);
  }

  lines.push('');
  lines.push(info.description);

  if (info.example) {
    lines.push('');
    lines.push(`**Usage:** \`${info.example}\``);
  }

  const docs = getCommandDocumentation(info.command);
  if (docs) {
    lines.push('');
    lines.push('---');
    lines.push(docs);
  }

  return lines.join('\n');
}

/**
 * Format command for display in update list
 */
export function formatCommandForList(info: CommandInfo): string {
  const icon = info.isSlashCommand ? '⚡' : info.isShortcut ? '⌨️' : '🖥️';
  return `${icon} \`${info.command}\` - ${info.description}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler Implementation
// ─────────────────────────────────────────────────────────────────────────────

export interface CommandHandlerOptions {
  interactive: boolean;
  showDocumentation: boolean;
}

/**
 * Create the command demo handler
 */
export function createCommandHandler(options: CommandHandlerOptions): ActionHandler {
  return {
    canHandle(entry: ParsedEntry, action: UserAction): boolean {
      return entry.category === 'command' && action === 'try_command';
    },

    async execute(entry: ParsedEntry, _action: UserAction): Promise<ActionResult> {
      const commands = extractCommandInfo(entry);

      if (commands.length === 0) {
        return {
          success: true,
          message: 'No commands found in entry',
        };
      }

      const previews: string[] = [];

      for (const cmd of commands) {
        const preview = generateCommandPreview(cmd);
        previews.push(preview);

        // In interactive mode, we'd prompt the user to try each command
        // For now, we just provide the documentation
        if (options.showDocumentation) {
          const docs = getCommandDocumentation(cmd.command);
          if (docs) {
            previews.push('\n📚 Documentation available');
          }
        }
      }

      const primaryCommand = commands[0];

      return {
        success: true,
        message: `Command ready: ${primaryCommand.command}`,
        details: {
          commands: commands.map(c => c.command),
          preview: previews.join('\n\n'),
          canExecute: primaryCommand.isSlashCommand,
        },
      };
    },

    describe(): string {
      return 'Command Demo Handler - explains and demonstrates new commands';
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if a command can be safely executed in demo mode
 */
export function canExecuteCommand(info: CommandInfo): boolean {
  // Slash commands can generally be executed
  if (info.isSlashCommand) {
    // Some commands are safe to demo
    const safeToDemoCommands = ['/help', '/tasks', '/keybindings'];
    return safeToDemoCommands.includes(info.command);
  }

  // Shortcuts can't be "executed" programmatically
  if (info.isShortcut) {
    return false;
  }

  // CLI flags need context
  return false;
}

/**
 * Generate the instruction for trying a command
 */
export function generateTryInstruction(info: CommandInfo): string {
  if (info.isSlashCommand) {
    return `Type \`${info.command}\` in the Claude Code prompt to try this command.`;
  }

  if (info.isShortcut) {
    return `Press \`${info.command}\` while in Claude Code to use this shortcut.`;
  }

  if (info.isCliFlag) {
    return `Run \`claude ${info.command}\` from your terminal to use this flag.`;
  }

  return `Try using ${info.command} in Claude Code.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all commands from a list of entries
 */
export function getAllCommands(entries: ParsedEntry[]): CommandInfo[] {
  const commands: CommandInfo[] = [];

  for (const entry of entries) {
    if (entry.category === 'command') {
      commands.push(...extractCommandInfo(entry));
    }
  }

  // Deduplicate by command string
  const seen = new Set<string>();
  return commands.filter(cmd => {
    if (seen.has(cmd.command)) return false;
    seen.add(cmd.command);
    return true;
  });
}

/**
 * Generate a summary of all new commands
 */
export function generateCommandsSummary(entries: ParsedEntry[]): string {
  const commands = getAllCommands(entries);

  if (commands.length === 0) {
    return 'No new commands in this update.';
  }

  const lines = ['## New Commands\n'];

  const slashCommands = commands.filter(c => c.isSlashCommand);
  const shortcuts = commands.filter(c => c.isShortcut);
  const flags = commands.filter(c => c.isCliFlag);

  if (slashCommands.length > 0) {
    lines.push('### Slash Commands\n');
    for (const cmd of slashCommands) {
      lines.push(formatCommandForList(cmd));
    }
    lines.push('');
  }

  if (shortcuts.length > 0) {
    lines.push('### Keyboard Shortcuts\n');
    for (const cmd of shortcuts) {
      lines.push(formatCommandForList(cmd));
    }
    lines.push('');
  }

  if (flags.length > 0) {
    lines.push('### CLI Flags\n');
    for (const cmd of flags) {
      lines.push(formatCommandForList(cmd));
    }
    lines.push('');
  }

  return lines.join('\n');
}

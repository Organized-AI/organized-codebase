/**
 * Tests for Command Handler
 *
 * Run with: npx tsx command-handler.test.ts
 */

import {
  extractCommandInfo,
  getCommandDocumentation,
  generateCommandPreview,
  formatCommandForList,
  createCommandHandler,
  canExecuteCommand,
  generateTryInstruction,
  getAllCommands,
  generateCommandsSummary,
} from './command-handler';
import { parseEntries } from './entry-parser';
import type { ChangelogEntry } from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const COMMAND_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.21',
    section: 'Added',
    content: '`/teleport` and `/remote-env` slash commands for claude.ai subscribers. `/teleport` lets you resume a Claude Code session',
    rawLine: '- teleport...',
  },
  {
    version: '2.1.20',
    section: 'Added',
    content: 'Customizable keyboard shortcuts. Run `/keybindings` to get started',
    rawLine: '- keybindings...',
  },
  {
    version: '2.1.18',
    section: 'Added',
    content: 'New Vim motions: `;` and `,` to repeat f/F/t/T motions, Ctrl+G for external editor',
    rawLine: '- vim...',
  },
  {
    version: '2.1.17',
    section: 'Added',
    content: '`--tools` flag support in interactive mode to restrict which built-in tools Claude can use',
    rawLine: '- tools flag...',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Test Utilities
// ─────────────────────────────────────────────────────────────────────────────

function test(name: string, fn: () => void | Promise<void>): void {
  Promise.resolve(fn())
    .then(() => console.log(`✓ ${name}`))
    .catch(error => {
      console.error(`✗ ${name}`);
      console.error(`  ${error}`);
      process.exitCode = 1;
    });
}

function assertEqual<T>(actual: T, expected: T, msg?: string): void {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(
      `${msg ? msg + ': ' : ''}Expected ${expectedStr}, got ${actualStr}`
    );
  }
}

function assertTrue(condition: boolean, msg: string): void {
  if (!condition) {
    throw new Error(msg);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n📋 Command Handler Tests\n');

test('extractCommandInfo finds slash commands', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const teleportEntry = parsed[0];
  const commands = extractCommandInfo(teleportEntry);

  assertTrue(commands.length >= 2, 'Should find /teleport and /remote-env');

  const teleport = commands.find(c => c.command === '/teleport');
  assertTrue(teleport !== undefined, 'Should find /teleport');
  assertEqual(teleport?.isSlashCommand, true);
});

test('extractCommandInfo finds keyboard shortcuts', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const vimEntry = parsed[2];
  const commands = extractCommandInfo(vimEntry);

  const shortcut = commands.find(c => c.isShortcut);
  assertTrue(shortcut !== undefined, 'Should find Ctrl+G shortcut');
});

test('extractCommandInfo finds CLI flags', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const flagEntry = parsed[3];
  const commands = extractCommandInfo(flagEntry);

  const flag = commands.find(c => c.command === '--tools');
  assertTrue(flag !== undefined, 'Should find --tools flag');
  assertEqual(flag?.isCliFlag, true);
});

test('getCommandDocumentation returns docs for known commands', () => {
  const docs = getCommandDocumentation('/teleport');

  assertTrue(docs !== null, 'Should have docs for /teleport');
  assertTrue(docs!.includes('claude.ai'), 'Should mention claude.ai');
});

test('getCommandDocumentation returns null for unknown commands', () => {
  const docs = getCommandDocumentation('/unknown-command');

  assertEqual(docs, null);
});

test('generateCommandPreview includes command type', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const commands = extractCommandInfo(parsed[0]);
  const preview = generateCommandPreview(commands[0]);

  assertTrue(preview.includes('Slash Command'), 'Should identify command type');
  assertTrue(preview.includes('/teleport'), 'Should include command');
});

test('formatCommandForList produces formatted string', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const commands = extractCommandInfo(parsed[0]);
  const formatted = formatCommandForList(commands[0]);

  assertTrue(formatted.includes('⚡'), 'Should have icon');
  assertTrue(formatted.includes('`/teleport`'), 'Should have command in backticks');
});

test('createCommandHandler handles command entries', () => {
  const handler = createCommandHandler({
    interactive: false,
    showDocumentation: true,
  });

  const parsed = parseEntries(COMMAND_ENTRIES);
  const commandEntry = parsed[0];

  assertTrue(
    handler.canHandle(commandEntry, 'try_command'),
    'Should handle command + try_command'
  );
});

test('createCommandHandler executes successfully', async () => {
  const handler = createCommandHandler({
    interactive: false,
    showDocumentation: true,
  });

  const parsed = parseEntries(COMMAND_ENTRIES);
  const commandEntry = parsed[0];

  const result = await handler.execute(commandEntry, 'try_command');

  assertTrue(result.success, 'Should succeed');
  assertTrue(
    (result as { message: string }).message.includes('/teleport'),
    'Should mention command'
  );
});

test('canExecuteCommand returns true for safe commands', () => {
  assertEqual(
    canExecuteCommand({ command: '/help', description: '', isSlashCommand: true, isShortcut: false, isCliFlag: false }),
    true
  );
  assertEqual(
    canExecuteCommand({ command: '/tasks', description: '', isSlashCommand: true, isShortcut: false, isCliFlag: false }),
    true
  );
});

test('canExecuteCommand returns false for shortcuts', () => {
  assertEqual(
    canExecuteCommand({ command: 'Ctrl+G', description: '', isSlashCommand: false, isShortcut: true, isCliFlag: false }),
    false
  );
});

test('generateTryInstruction produces appropriate instructions', () => {
  const slashInstruction = generateTryInstruction({
    command: '/teleport',
    description: '',
    isSlashCommand: true,
    isShortcut: false,
    isCliFlag: false,
  });

  assertTrue(slashInstruction.includes('Type'), 'Should say Type for slash commands');

  const shortcutInstruction = generateTryInstruction({
    command: 'Ctrl+G',
    description: '',
    isSlashCommand: false,
    isShortcut: true,
    isCliFlag: false,
  });

  assertTrue(shortcutInstruction.includes('Press'), 'Should say Press for shortcuts');
});

test('getAllCommands deduplicates commands', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const allCommands = getAllCommands(parsed);

  const commandNames = allCommands.map(c => c.command);
  const uniqueNames = new Set(commandNames);

  assertEqual(commandNames.length, uniqueNames.size, 'Should have no duplicates');
});

test('generateCommandsSummary produces markdown', () => {
  const parsed = parseEntries(COMMAND_ENTRIES);
  const summary = generateCommandsSummary(parsed);

  assertTrue(summary.includes('## New Commands'), 'Should have header');
  assertTrue(summary.includes('### Slash Commands'), 'Should categorize');
});

setTimeout(() => {
  console.log('\n✅ All tests completed!\n');
}, 100);

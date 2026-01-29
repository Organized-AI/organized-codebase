/**
 * Tests for Entry Parser
 *
 * Run with: npx tsx entry-parser.test.ts
 */

import {
  parseEntry,
  parseEntries,
  groupByCategory,
  groupByActionType,
  getActionableEntries,
  getSummaryStats,
  type ParsedEntry,
} from './entry-parser';
import type { ChangelogEntry } from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.22',
    section: 'Added',
    content: '`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable to override the default file read token limit',
    rawLine: '- `CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable...',
  },
  {
    version: '2.1.21',
    section: 'Added',
    content: '`/teleport` and `/remote-env` slash commands for claude.ai subscribers',
    rawLine: '- `/teleport` and `/remote-env` slash commands...',
  },
  {
    version: '2.1.20',
    section: 'Fixed',
    content: 'Session compaction issues that could cause resume to load full history',
    rawLine: '- Session compaction issues...',
  },
  {
    version: '2.1.19',
    section: 'Added',
    content: '**New Task system** replacing the old TODO/TodoWrite system',
    rawLine: '- **New Task system** replacing...',
  },
  {
    version: '2.1.18',
    section: 'Added',
    content: 'Wildcard syntax `mcp__server__*` for MCP tool permissions',
    rawLine: '- Wildcard syntax `mcp__server__*`...',
  },
  {
    version: '2.1.17',
    section: 'Improved',
    content: 'Terminal rendering performance when using native installer',
    rawLine: '- Terminal rendering performance...',
  },
  {
    version: '2.1.16',
    section: 'Changed',
    content: '`#` shortcut for quick memory entry. Now ask Claude directly to "remember this" instead',
    rawLine: '- `#` shortcut for quick memory...',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Test Utilities
// ─────────────────────────────────────────────────────────────────────────────

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error}`);
    process.exitCode = 1;
  }
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

console.log('\n📋 Entry Parser Tests\n');

test('parseEntry classifies config entries correctly', () => {
  const entry = SAMPLE_ENTRIES[0]; // env var entry
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'config', 'Should detect config category');
  assertEqual(parsed.actionType, 'config_update', 'Should map to config_update action');
  assertEqual(parsed.actionRequired, true, 'Config should require action');
  assertTrue(
    parsed.extractedDetails.envVars?.includes('CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS') ?? false,
    'Should extract env var name'
  );
});

test('parseEntry classifies command entries correctly', () => {
  const entry = SAMPLE_ENTRIES[1]; // /teleport command
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'command', 'Should detect command category');
  assertEqual(parsed.actionType, 'learn_command', 'Should map to learn_command action');
  assertTrue(
    parsed.extractedDetails.commands?.includes('/teleport') ?? false,
    'Should extract command name'
  );
});

test('parseEntry classifies fix entries from section header', () => {
  const entry = SAMPLE_ENTRIES[2]; // Fixed section
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'fix', 'Should detect fix category from section');
  assertEqual(parsed.actionRequired, false, 'Fixes should not require action');
});

test('parseEntry classifies architecture entries correctly', () => {
  const entry = SAMPLE_ENTRIES[3]; // New Task system
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'architecture', 'Should detect architecture category');
  assertTrue(parsed.confidence >= 0.5, 'Should have reasonable confidence');
});

test('parseEntry classifies tool entries correctly', () => {
  const entry = SAMPLE_ENTRIES[4]; // MCP entry
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'tool', 'Should detect tool category');
  assertEqual(parsed.actionType, 'awareness', 'Tool changes are awareness');
});

test('parseEntry classifies improvement entries from section', () => {
  const entry = SAMPLE_ENTRIES[5]; // Improved section
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'improvement', 'Should detect improvement from section');
  assertEqual(parsed.actionRequired, false, 'Improvements should not require action');
});

test('parseEntry classifies breaking changes correctly', () => {
  const entry = SAMPLE_ENTRIES[6]; // Changed section with "instead"
  const parsed = parseEntry(entry);

  assertEqual(parsed.category, 'breaking', 'Should detect breaking from Changed section');
  assertEqual(parsed.actionType, 'migrate', 'Breaking changes require migration');
  assertEqual(parsed.actionRequired, true, 'Breaking changes require action');
});

test('parseEntries processes multiple entries', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);

  assertEqual(parsed.length, 7, 'Should parse all entries');
  assertTrue(
    parsed.every(p => p.category !== undefined),
    'All should have categories'
  );
});

test('groupByCategory groups correctly', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupByCategory(parsed);

  assertTrue(groups.has('config'), 'Should have config group');
  assertTrue(groups.has('command'), 'Should have command group');
  assertTrue(groups.has('fix'), 'Should have fix group');
});

test('groupByActionType groups correctly', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupByActionType(parsed);

  assertTrue(groups.has('config_update'), 'Should have config_update group');
  assertTrue(groups.has('learn_command'), 'Should have learn_command group');
  assertTrue(groups.has('awareness'), 'Should have awareness group');
});

test('getActionableEntries filters correctly', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const actionable = getActionableEntries(parsed);

  assertTrue(
    actionable.every(e => e.actionRequired),
    'All returned entries should require action'
  );
  assertTrue(
    actionable.length < parsed.length,
    'Should filter out non-actionable entries'
  );
});

test('getSummaryStats returns correct counts', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const stats = getSummaryStats(parsed);

  assertEqual(stats.total, 7, 'Total should be 7');
  assertTrue(stats.actionRequired > 0, 'Some should require action');
  assertTrue(
    Object.keys(stats.byCategory).length > 0,
    'Should have category breakdown'
  );
});

console.log('\n✅ All tests passed!\n');

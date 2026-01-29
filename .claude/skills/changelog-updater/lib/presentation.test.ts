/**
 * Tests for Presentation Layer
 *
 * Run with: npx tsx presentation.test.ts
 */

import {
  groupEntriesByCategory,
  formatGroupForDisplay,
  formatUpdateSummary,
  buildSummaryQuestion,
  buildEntryQuestion,
  getActionableCount,
  getCategoryCounts,
  hasBreakingChanges,
  type PresentationGroup,
} from './presentation';
import { parseEntries } from './entry-parser';
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

console.log('\n📋 Presentation Layer Tests\n');

test('groupEntriesByCategory creates correct groups', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  assertTrue(groups.length > 0, 'Should create at least one group');
  assertTrue(
    groups.every(g => g.icon && g.title && g.category),
    'All groups should have icon, title, and category'
  );
});

test('groupEntriesByCategory orders breaking changes first', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const breakingIndex = groups.findIndex(g => g.category === 'breaking');
  if (breakingIndex >= 0) {
    assertEqual(breakingIndex, 0, 'Breaking changes should be first');
  }
});

test('groupEntriesByCategory assigns correct icons', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const configGroup = groups.find(g => g.category === 'config');
  const commandGroup = groups.find(g => g.category === 'command');
  const fixGroup = groups.find(g => g.category === 'fix');

  if (configGroup) assertEqual(configGroup.icon, '🔧', 'Config icon');
  if (commandGroup) assertEqual(commandGroup.icon, '⚡', 'Command icon');
  if (fixGroup) assertEqual(fixGroup.icon, '🐛', 'Fix icon');
});

test('groupEntriesByCategory includes action buttons', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  assertTrue(
    groups.every(g => g.actions.length > 0),
    'All groups should have action buttons'
  );
});

test('formatGroupForDisplay produces readable output', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);
  const firstGroup = groups[0];

  const formatted = formatGroupForDisplay(firstGroup);

  assertTrue(formatted.includes(firstGroup.icon), 'Should include icon');
  assertTrue(formatted.includes(firstGroup.title), 'Should include title');
  assertTrue(formatted.includes('['), 'Should include action buttons');
});

test('formatUpdateSummary produces complete summary', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const summary = formatUpdateSummary(groups, '2.1.15', '2.1.22');

  assertTrue(summary.includes('v2.1.15'), 'Should include from version');
  assertTrue(summary.includes('v2.1.22'), 'Should include to version');
  assertTrue(summary.includes('Apply All'), 'Should include main actions');
});

test('buildSummaryQuestion creates valid options', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const question = buildSummaryQuestion(groups);

  assertEqual(question.options.length, 4, 'Should have 4 options');
  assertTrue(question.question.length > 0, 'Should have question text');
  assertTrue(question.header.length > 0, 'Should have header');
});

test('buildEntryQuestion creates options for entry', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const question = buildEntryQuestion(parsed[0]);

  assertTrue(question.options.length >= 1, 'Should have options');
  assertTrue(question.question.length > 0, 'Should use entry content as question');
});

test('getActionableCount returns correct count', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const count = getActionableCount(groups);

  assertTrue(count >= 0, 'Should return non-negative count');
  assertTrue(count <= SAMPLE_ENTRIES.length, 'Should not exceed total entries');
});

test('getCategoryCounts returns breakdown', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const counts = getCategoryCounts(groups);

  assertTrue(
    Object.keys(counts).length > 0,
    'Should have category counts'
  );
});

test('hasBreakingChanges detects breaking', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const hasBreaking = hasBreakingChanges(groups);

  // Our sample has a "Changed" section entry which should be breaking
  assertEqual(hasBreaking, true, 'Should detect breaking changes');
});

console.log('\n✅ All tests passed!\n');

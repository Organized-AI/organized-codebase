/**
 * Tests for Migration Handler (feat-008)
 *
 * Run with: npx tsx --test migration-handler.test.ts
 */

import {
  detectBreakingChange,
  generateMigrationGuide,
  createMigrationHandler,
  formatMigrationGuide,
  formatSeverity,
  getBreakingChanges,
  generateAllMigrationGuides,
  generateBreakingChangesSummary,
} from './migration-handler';
import { parseEntries } from './entry-parser';
import type { ChangelogEntry } from './diff-detector';
import type { ParsedEntry } from './entry-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const BREAKING_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.22',
    section: 'Removed',
    content: 'Removed the legacy `/teleport` command. Use `/resume` instead.',
    rawLine: '- Removed...',
  },
  {
    version: '2.1.21',
    section: 'Changed',
    content: 'Changed the default behavior of MCP tools to require explicit approval.',
    rawLine: '- Changed...',
  },
  {
    version: '2.1.20',
    section: 'Added',
    content: 'The `--verbose` flag is now `--debug`. Old flag name is deprecated and will be removed in v3.0.',
    rawLine: '- renamed...',
  },
  {
    version: '2.1.19',
    section: 'Changed',
    content: 'Deprecated `CLAUDE_DEBUG` environment variable. Please use `CLAUDE_LOG_LEVEL` instead.',
    rawLine: '- deprecated...',
  },
];

const NON_BREAKING_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.22',
    section: 'Added',
    content: 'New `/keybindings` command for customizing shortcuts.',
    rawLine: '- Added...',
  },
  {
    version: '2.1.21',
    section: 'Fixed',
    content: 'Fixed a bug where the file watcher would crash on large directories.',
    rawLine: '- Fixed...',
  },
  {
    version: '2.1.20',
    section: 'Improved',
    content: 'Improved performance of the diff algorithm by 40%.',
    rawLine: '- Improved...',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Test Utilities
// ─────────────────────────────────────────────────────────────────────────────

function test(name: string, fn: () => void | Promise<void>): void {
  Promise.resolve(fn())
    .then(() => console.log(`  PASS: ${name}`))
    .catch(error => {
      console.error(`  FAIL: ${name}`);
      console.error(`    ${error}`);
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

function assertNotNull<T>(value: T | null | undefined, msg: string): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(msg);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nMigration Handler Tests\n');
console.log('=============================================');

// ─────────────────────────────────────────────────────────────────────────────
// detectBreakingChange Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\ndetectBreakingChange:');

test('detects "removed" type from section header', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const info = detectBreakingChange(parsed[0]);

  assertNotNull(info, 'Should detect breaking change');
  assertEqual(info.type, 'removed', 'Should be removed type');
  assertEqual(info.affectedArea, 'Commands', 'Should detect Commands area');
});

test('detects "changed" type from content', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[1]]);
  const info = detectBreakingChange(parsed[0]);

  assertNotNull(info, 'Should detect breaking change');
  assertEqual(info.type, 'changed', 'Should be changed type');
  assertEqual(info.affectedArea, 'MCP Integration', 'Should detect MCP area');
});

test('detects "renamed" type from content keywords', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[2]]);
  const info = detectBreakingChange(parsed[0]);

  assertNotNull(info, 'Should detect breaking change');
  // This should detect renamed due to "now `--debug`" pattern
  assertTrue(
    info.type === 'renamed' || info.type === 'deprecated',
    'Should be renamed or deprecated type'
  );
});

test('detects "deprecated" type from content', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[3]]);
  const info = detectBreakingChange(parsed[0]);

  assertNotNull(info, 'Should detect breaking change');
  assertEqual(info.type, 'deprecated', 'Should be deprecated type');
  assertEqual(info.affectedArea, 'Environment', 'Should detect Environment area');
});

test('returns null for non-breaking entries', () => {
  const parsed = parseEntries(NON_BREAKING_ENTRIES);

  for (const entry of parsed) {
    const info = detectBreakingChange(entry);
    assertEqual(info, null, `Should be null for: ${entry.original.content}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// generateMigrationGuide Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\ngenerateMigrationGuide:');

test('generates guide for removed feature', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');
  assertEqual(guide.severity, 'high', 'Removed should be high severity');
  assertTrue(guide.steps.length >= 3, 'Should have at least 3 steps');
  assertTrue(guide.title.includes('Commands'), 'Title should include area');
});

test('generates guide for changed behavior', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[1]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');
  assertEqual(guide.severity, 'medium', 'Changed should be medium severity');
  assertTrue(guide.steps.length >= 3, 'Should have steps');
});

test('generates guide with low severity for deprecated', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[3]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');
  assertEqual(guide.severity, 'low', 'Deprecated should be low severity');
});

test('includes estimated effort in guide', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');
  assertNotNull(guide.estimatedEffort, 'Should have estimated effort');
  assertTrue(guide.estimatedEffort.includes('minute'), 'Should mention minutes');
});

test('returns null for non-breaking entry', () => {
  const parsed = parseEntries(NON_BREAKING_ENTRIES);
  const guide = generateMigrationGuide(parsed[0]);

  assertEqual(guide, null, 'Should return null for non-breaking');
});

// ─────────────────────────────────────────────────────────────────────────────
// createMigrationHandler Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\ncreateMigrationHandler:');

test('canHandle returns true for breaking + view_migration', () => {
  const handler = createMigrationHandler({
    projectRoot: '/tmp',
    interactive: false,
  });

  const parsed = parseEntries([BREAKING_ENTRIES[0]]);

  assertTrue(
    handler.canHandle(parsed[0], 'view_migration'),
    'Should handle breaking + view_migration'
  );
});

test('canHandle returns false for non-breaking entries', () => {
  const handler = createMigrationHandler({
    projectRoot: '/tmp',
    interactive: false,
  });

  const parsed = parseEntries(NON_BREAKING_ENTRIES);

  assertTrue(
    !handler.canHandle(parsed[0], 'view_migration'),
    'Should not handle non-breaking entries'
  );
});

test('canHandle returns false for wrong action', () => {
  const handler = createMigrationHandler({
    projectRoot: '/tmp',
    interactive: false,
  });

  const parsed = parseEntries([BREAKING_ENTRIES[0]]);

  assertTrue(
    !handler.canHandle(parsed[0], 'apply'),
    'Should not handle apply action'
  );
});

test('execute returns success with formatted guide', async () => {
  const handler = createMigrationHandler({
    projectRoot: '/tmp',
    interactive: false,
  });

  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const result = await handler.execute(parsed[0], 'view_migration');

  assertTrue(result.success, 'Should succeed');

  if (result.success) {
    assertTrue(result.message.includes('##'), 'Should have markdown headers');
    assertTrue(result.message.includes('Migration Steps'), 'Should have steps section');
    assertNotNull(result.details, 'Should have details');
    assertTrue(
      (result.details as { severity: string }).severity !== undefined,
      'Should have severity in details'
    );
  }
});

test('handler has description', () => {
  const handler = createMigrationHandler({
    projectRoot: '/tmp',
    interactive: false,
  });

  const description = handler.describe();

  assertTrue(description.length > 0, 'Should have description');
  assertTrue(description.includes('Migration'), 'Should mention migration');
});

// ─────────────────────────────────────────────────────────────────────────────
// formatMigrationGuide Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nformatMigrationGuide:');

test('formats guide with severity badge', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');

  const formatted = formatMigrationGuide(guide);

  assertTrue(formatted.includes('**Severity:**'), 'Should have severity label');
  // Check for emoji badges (circles)
  assertTrue(
    formatted.includes('\u{1F534}') ||
    formatted.includes('\u{1F7E0}') ||
    formatted.includes('\u{1F7E1}') ||
    formatted.includes('\u{1F7E2}'),
    'Should have severity badge emoji'
  );
});

test('formats guide with numbered steps', () => {
  const parsed = parseEntries([BREAKING_ENTRIES[0]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');

  const formatted = formatMigrationGuide(guide);

  assertTrue(formatted.includes('1. **'), 'Should have step 1');
  assertTrue(formatted.includes('2. **'), 'Should have step 2');
});

test('marks automated steps', () => {
  // Renamed changes have automated steps
  const parsed = parseEntries([BREAKING_ENTRIES[2]]);
  const guide = generateMigrationGuide(parsed[0]);

  assertNotNull(guide, 'Should generate guide');

  const formatted = formatMigrationGuide(guide);

  // Check if any step is marked as automated
  const hasAutomatedStep = guide.steps.some(s => s.automated);
  if (hasAutomatedStep) {
    assertTrue(
      formatted.includes('can be automated'),
      'Should mark automated steps'
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// formatSeverity Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nformatSeverity:');

test('formats critical with red badge', () => {
  const result = formatSeverity('critical');
  assertTrue(result.includes('\u{1F534}'), 'Should have red badge');
  assertTrue(result.includes('Critical'), 'Should have capitalized label');
});

test('formats high with orange badge', () => {
  const result = formatSeverity('high');
  assertTrue(result.includes('\u{1F7E0}'), 'Should have orange badge');
  assertTrue(result.includes('High'), 'Should have capitalized label');
});

test('formats medium with yellow badge', () => {
  const result = formatSeverity('medium');
  assertTrue(result.includes('\u{1F7E1}'), 'Should have yellow badge');
  assertTrue(result.includes('Medium'), 'Should have capitalized label');
});

test('formats low with green badge', () => {
  const result = formatSeverity('low');
  assertTrue(result.includes('\u{1F7E2}'), 'Should have green badge');
  assertTrue(result.includes('Low'), 'Should have capitalized label');
});

// ─────────────────────────────────────────────────────────────────────────────
// Batch Operation Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\nBatch operations:');

test('getBreakingChanges filters correctly', () => {
  const allEntries = [...BREAKING_ENTRIES, ...NON_BREAKING_ENTRIES];
  const parsed = parseEntries(allEntries);
  const breaking = getBreakingChanges(parsed);

  // Should have all breaking entries (4) and none of the non-breaking
  assertEqual(breaking.length, 4, 'Should have 4 breaking entries');

  for (const entry of breaking) {
    assertEqual(entry.category, 'breaking', 'All should be breaking category');
  }
});

test('generateAllMigrationGuides processes all breaking', () => {
  const parsed = parseEntries(BREAKING_ENTRIES);
  const guides = generateAllMigrationGuides(parsed);

  assertEqual(guides.length, 4, 'Should generate 4 guides');

  for (const { guide } of guides) {
    assertNotNull(guide.title, 'Each should have title');
    assertNotNull(guide.severity, 'Each should have severity');
    assertTrue(guide.steps.length > 0, 'Each should have steps');
  }
});

test('generateBreakingChangesSummary creates report', () => {
  const parsed = parseEntries(BREAKING_ENTRIES);
  const summary = generateBreakingChangesSummary(parsed);

  assertTrue(summary.includes('# Breaking Changes Summary'), 'Should have header');
  assertTrue(summary.includes('**Total Breaking Changes:** 4'), 'Should show count');
  assertTrue(summary.includes('Estimated Total Migration Time'), 'Should have total time');
});

test('generateBreakingChangesSummary handles empty list', () => {
  const parsed = parseEntries(NON_BREAKING_ENTRIES);
  const summary = generateBreakingChangesSummary(parsed);

  assertTrue(
    summary.includes('No breaking changes'),
    'Should indicate no breaking changes'
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Completion
// ─────────────────────────────────────────────────────────────────────────────

setTimeout(() => {
  console.log('\n=============================================');
  console.log('All tests completed!');
  console.log('');
}, 200);

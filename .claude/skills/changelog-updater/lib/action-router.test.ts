/**
 * Tests for Action Router
 *
 * Run with: npx tsx action-router.test.ts
 */

import {
  getHandlerTypeForAction,
  requiresHandler,
  getDefaultAction,
  getRecommendedAction,
  getEntryId,
  createExecutionPlan,
  executePlan,
  createApplyAllPlan,
  formatReport,
  getReportSummary,
  registerHandler,
  type ActionHandler,
  type ActionResult,
} from './action-router';
import { parseEntries } from './entry-parser';
import { groupEntriesByCategory } from './presentation';
import type { ChangelogEntry } from './diff-detector';
import type { ParsedEntry } from './entry-parser';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.22',
    section: 'Added',
    content: '`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable to override the default file read token limit',
    rawLine: '- env var...',
  },
  {
    version: '2.1.21',
    section: 'Added',
    content: '`/teleport` and `/remote-env` slash commands for claude.ai subscribers',
    rawLine: '- commands...',
  },
  {
    version: '2.1.20',
    section: 'Fixed',
    content: 'Session compaction issues that could cause resume to load full history',
    rawLine: '- fix...',
  },
  {
    version: '2.1.16',
    section: 'Changed',
    content: '`#` shortcut for quick memory entry. Now ask Claude directly instead',
    rawLine: '- breaking...',
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

console.log('\n📋 Action Router Tests\n');

test('getHandlerTypeForAction maps actions correctly', () => {
  assertEqual(getHandlerTypeForAction('apply'), 'config');
  assertEqual(getHandlerTypeForAction('try_command'), 'command');
  assertEqual(getHandlerTypeForAction('view_migration'), 'migration');
  assertEqual(getHandlerTypeForAction('acknowledge'), 'awareness');
  assertEqual(getHandlerTypeForAction('skip'), 'skip');
});

test('requiresHandler returns false for acknowledgment actions', () => {
  assertEqual(requiresHandler('acknowledge'), false);
  assertEqual(requiresHandler('acknowledge_all'), false);
  assertEqual(requiresHandler('skip'), false);
  assertEqual(requiresHandler('dismiss'), false);
});

test('requiresHandler returns true for executable actions', () => {
  assertEqual(requiresHandler('apply'), true);
  assertEqual(requiresHandler('try_command'), true);
  assertEqual(requiresHandler('view_migration'), true);
  assertEqual(requiresHandler('apply_all'), true);
});

test('getDefaultAction returns appropriate action for category', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);

  const configEntry = parsed.find(e => e.category === 'config');
  const commandEntry = parsed.find(e => e.category === 'command');
  const fixEntry = parsed.find(e => e.category === 'fix');
  const breakingEntry = parsed.find(e => e.category === 'breaking');

  if (configEntry) assertEqual(getDefaultAction(configEntry), 'apply');
  if (commandEntry) assertEqual(getDefaultAction(commandEntry), 'try_command');
  if (fixEntry) assertEqual(getDefaultAction(fixEntry), 'acknowledge');
  if (breakingEntry) assertEqual(getDefaultAction(breakingEntry), 'view_migration');
});

test('getRecommendedAction provides reason for config entries', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const configEntry = parsed.find(e => e.category === 'config');

  if (configEntry) {
    const rec = getRecommendedAction(configEntry);
    assertEqual(rec.action, 'apply');
    assertTrue(rec.reason.length > 0, 'Should have reason');
    assertTrue(rec.reason.includes('CLAUDE_CODE'), 'Should mention env var');
  }
});

test('getEntryId generates consistent IDs', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const id1 = getEntryId(parsed[0]);
  const id2 = getEntryId(parsed[0]);

  assertEqual(id1, id2, 'Same entry should get same ID');
  assertTrue(id1.startsWith('2.1.22-'), 'ID should include version');
});

test('getEntryId generates unique IDs for different entries', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const ids = parsed.map(getEntryId);
  const uniqueIds = new Set(ids);

  assertEqual(uniqueIds.size, ids.length, 'All IDs should be unique');
});

test('createExecutionPlan creates valid plan from groups', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const plan = createExecutionPlan(groups, new Map(), {
    projectRoot: '/test',
    dryRun: true,
    interactive: false,
  });

  assertTrue(plan.entries.length > 0, 'Should have entries');
  assertEqual(plan.entries.length, plan.actions.size, 'Should have action for each entry');
});

test('executePlan handles dry run mode', async () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const plan = createExecutionPlan(groups, new Map(), {
    projectRoot: '/test',
    dryRun: true,
    interactive: false,
  });

  const report = await executePlan(plan);

  assertTrue(report.totalEntries > 0, 'Should have entries');
  assertEqual(report.failed, 0, 'Dry run should not fail');
});

test('createApplyAllPlan uses recommended actions', () => {
  const parsed = parseEntries(SAMPLE_ENTRIES);
  const groups = groupEntriesByCategory(parsed);

  const plan = createApplyAllPlan(groups, {
    projectRoot: '/test',
    dryRun: true,
    interactive: false,
  });

  // Check that config entries get 'apply' action
  for (const entry of plan.entries) {
    const entryId = getEntryId(entry);
    const action = plan.actions.get(entryId);
    const recommended = getRecommendedAction(entry);
    assertEqual(action, recommended.action, 'Should use recommended action');
  }
});

test('formatReport produces valid markdown', () => {
  const report = {
    totalEntries: 4,
    successful: 2,
    failed: 1,
    skipped: 1,
    results: [],
    timestamp: new Date().toISOString(),
  };

  const markdown = formatReport(report);

  assertTrue(markdown.includes('## Changelog Update Report'), 'Should have header');
  assertTrue(markdown.includes('**Total entries:** 4'), 'Should show total');
  assertTrue(markdown.includes('**Failed:** 1'), 'Should show failed');
});

test('getReportSummary returns appropriate message', () => {
  const successReport = {
    totalEntries: 4,
    successful: 3,
    failed: 0,
    skipped: 1,
    results: [],
    timestamp: '',
  };

  const failReport = {
    totalEntries: 4,
    successful: 2,
    failed: 1,
    skipped: 1,
    results: [],
    timestamp: '',
  };

  assertTrue(getReportSummary(successReport).includes('✅'), 'Success should use check');
  assertTrue(getReportSummary(failReport).includes('⚠️'), 'Failure should use warning');
});

test('registerHandler adds handler to registry', () => {
  const mockHandler: ActionHandler = {
    canHandle: (entry, action) => action === 'apply' && entry.category === 'config',
    execute: async () => ({ success: true, message: 'Applied' }),
    describe: () => 'Mock config handler',
  };

  // This should not throw
  registerHandler(mockHandler);
});

// Give async tests time to complete
setTimeout(() => {
  console.log('\n✅ All tests completed!\n');
}, 100);

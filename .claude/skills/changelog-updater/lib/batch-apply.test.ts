/**
 * Batch Apply Mode Tests (feat-011)
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import type { ParsedEntry, EntryCategory } from './entry-parser';
import type { ActionHandler, ActionResult } from './action-router';
import type { UserAction } from './presentation';
import {
  createBatchPlan,
  executeBatch,
  executeBatchSequential,
  executeBatchParallel,
  previewBatch,
  formatPreview,
  filterPlanByCategory,
  filterPlanByAction,
  filterPlanToActionable,
  getBatchStats,
  formatBatchStats,
  formatBatchResult,
  hasBatchFailures,
  isBatchSuccess,
  type BatchAction,
  type BatchResult,
  type BatchOptions,
} from './batch-apply';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

function createMockEntry(
  category: EntryCategory,
  content: string = `Test ${category} entry`
): ParsedEntry {
  return {
    original: {
      version: '1.0.0',
      date: '2025-01-01',
      section: 'Added',
      content,
    },
    category,
    actionRequired: ['config', 'command', 'breaking', 'architecture'].includes(category),
    actionType: category === 'config' ? 'config_update' : 'awareness',
    extractedDetails: {},
    confidence: 0.8,
  };
}

function createMockHandler(
  name: string,
  canHandleCategories: EntryCategory[],
  shouldSucceed: boolean = true
): ActionHandler {
  return {
    canHandle(entry: ParsedEntry, _action: UserAction): boolean {
      return canHandleCategories.includes(entry.category);
    },
    async execute(_entry: ParsedEntry, _action: UserAction): Promise<ActionResult> {
      if (shouldSucceed) {
        return { success: true, message: `${name} executed successfully` };
      }
      return { success: false, error: `${name} failed`, recoverable: true };
    },
    describe(): string {
      return name;
    },
  };
}

function createFailingHandler(name: string, categories: EntryCategory[]): ActionHandler {
  return {
    canHandle(entry: ParsedEntry, _action: UserAction): boolean {
      return categories.includes(entry.category);
    },
    async execute(_entry: ParsedEntry, _action: UserAction): Promise<ActionResult> {
      throw new Error(`${name} threw an exception`);
    },
    describe(): string {
      return name;
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests: createBatchPlan
// ─────────────────────────────────────────────────────────────────────────────

describe('createBatchPlan', () => {
  it('creates a plan for each entry', () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('command'),
      createMockEntry('fix'),
    ];
    const handlers: ActionHandler[] = [];

    const plan = createBatchPlan(entries, handlers);

    assert.strictEqual(plan.length, 3);
    assert.strictEqual(plan[0].entry.category, 'config');
    assert.strictEqual(plan[1].entry.category, 'command');
    assert.strictEqual(plan[2].entry.category, 'fix');
  });

  it('assigns default actions based on category', () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('command'),
      createMockEntry('breaking'),
      createMockEntry('fix'),
      createMockEntry('improvement'),
    ];
    const handlers: ActionHandler[] = [];

    const plan = createBatchPlan(entries, handlers);

    assert.strictEqual(plan[0].action, 'apply');          // config -> apply
    assert.strictEqual(plan[1].action, 'try_command');    // command -> try_command
    assert.strictEqual(plan[2].action, 'view_migration'); // breaking -> view_migration
    assert.strictEqual(plan[3].action, 'acknowledge');    // fix -> acknowledge
    assert.strictEqual(plan[4].action, 'acknowledge');    // improvement -> acknowledge
  });

  it('uses action overrides when provided', () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const handlers: ActionHandler[] = [];

    const overrides = new Map<ParsedEntry, UserAction>();
    overrides.set(entries[0], 'skip');
    overrides.set(entries[1], 'acknowledge');

    const plan = createBatchPlan(entries, handlers, overrides);

    assert.strictEqual(plan[0].action, 'skip');
    assert.strictEqual(plan[1].action, 'acknowledge');
  });

  it('matches handlers to entries', () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const configHandler = createMockHandler('ConfigHandler', ['config']);
    const commandHandler = createMockHandler('CommandHandler', ['command']);

    const plan = createBatchPlan(entries, [configHandler, commandHandler]);

    assert.strictEqual(plan[0].handler, configHandler);
    assert.strictEqual(plan[1].handler, commandHandler);
  });

  it('sets handler to null for acknowledgment actions', () => {
    const entries = [createMockEntry('fix'), createMockEntry('improvement')];
    const handler = createMockHandler('Handler', ['fix', 'improvement']);

    const plan = createBatchPlan(entries, [handler]);

    // fix and improvement default to 'acknowledge' which doesn't need a handler
    assert.strictEqual(plan[0].handler, null);
    assert.strictEqual(plan[1].handler, null);
  });

  it('sets handler to null when no handler matches', () => {
    const entries = [createMockEntry('config')];
    const wrongHandler = createMockHandler('WrongHandler', ['command']);

    const plan = createBatchPlan(entries, [wrongHandler]);

    assert.strictEqual(plan[0].handler, null);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: filterPlanByCategory
// ─────────────────────────────────────────────────────────────────────────────

describe('filterPlanByCategory', () => {
  it('filters plan to specified categories', () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('command'),
      createMockEntry('fix'),
      createMockEntry('breaking'),
    ];
    const plan = createBatchPlan(entries, []);

    const filtered = filterPlanByCategory(plan, ['config', 'breaking']);

    assert.strictEqual(filtered.length, 2);
    assert.strictEqual(filtered[0].entry.category, 'config');
    assert.strictEqual(filtered[1].entry.category, 'breaking');
  });

  it('returns empty array when no categories match', () => {
    const entries = [createMockEntry('fix')];
    const plan = createBatchPlan(entries, []);

    const filtered = filterPlanByCategory(plan, ['config']);

    assert.strictEqual(filtered.length, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: filterPlanByAction
// ─────────────────────────────────────────────────────────────────────────────

describe('filterPlanByAction', () => {
  it('filters plan to specified actions', () => {
    const entries = [
      createMockEntry('config'),      // apply
      createMockEntry('command'),     // try_command
      createMockEntry('fix'),         // acknowledge
    ];
    const plan = createBatchPlan(entries, []);

    const filtered = filterPlanByAction(plan, ['apply', 'try_command']);

    assert.strictEqual(filtered.length, 2);
    assert.strictEqual(filtered[0].action, 'apply');
    assert.strictEqual(filtered[1].action, 'try_command');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: filterPlanToActionable
// ─────────────────────────────────────────────────────────────────────────────

describe('filterPlanToActionable', () => {
  it('excludes acknowledgment-only items', () => {
    const entries = [
      createMockEntry('config'),      // apply (actionable)
      createMockEntry('fix'),         // acknowledge (not actionable)
      createMockEntry('command'),     // try_command (actionable)
      createMockEntry('improvement'), // acknowledge (not actionable)
    ];
    const plan = createBatchPlan(entries, []);

    const filtered = filterPlanToActionable(plan);

    assert.strictEqual(filtered.length, 2);
    assert.strictEqual(filtered[0].entry.category, 'config');
    assert.strictEqual(filtered[1].entry.category, 'command');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: previewBatch
// ─────────────────────────────────────────────────────────────────────────────

describe('previewBatch', () => {
  it('marks items with handlers as will execute', () => {
    const entries = [createMockEntry('config')];
    const handler = createMockHandler('ConfigHandler', ['config']);
    const plan = createBatchPlan(entries, [handler]);

    const preview = previewBatch(plan);

    assert.strictEqual(preview.length, 1);
    assert.strictEqual(preview[0].willExecute, true);
    assert.ok(preview[0].reason.includes('ConfigHandler'));
  });

  it('marks acknowledgment items as will not execute', () => {
    const entries = [createMockEntry('fix')];
    const plan = createBatchPlan(entries, []);

    const preview = previewBatch(plan);

    assert.strictEqual(preview[0].willExecute, false);
    assert.ok(preview[0].reason.includes('acknowledgment'));
  });

  it('marks items without handlers as will not execute', () => {
    const entries = [createMockEntry('config')];
    const plan = createBatchPlan(entries, []); // No handlers

    const preview = previewBatch(plan);

    assert.strictEqual(preview[0].willExecute, false);
    assert.ok(preview[0].reason.includes('No handler'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatPreview
// ─────────────────────────────────────────────────────────────────────────────

describe('formatPreview', () => {
  it('formats preview with will execute and will skip sections', () => {
    const entries = [
      createMockEntry('config', 'Config entry content'),
      createMockEntry('fix', 'Fix entry content'),
    ];
    const handler = createMockHandler('ConfigHandler', ['config']);
    const plan = createBatchPlan(entries, [handler]);
    const preview = previewBatch(plan);

    const formatted = formatPreview(preview);

    assert.ok(formatted.includes('Batch Execution Preview'));
    assert.ok(formatted.includes('Will Execute (1)'));
    assert.ok(formatted.includes('Will Skip (1)'));
    assert.ok(formatted.includes('Config entry'));
    assert.ok(formatted.includes('Fix entry'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: executeBatchSequential
// ─────────────────────────────────────────────────────────────────────────────

describe('executeBatchSequential', () => {
  it('executes actions sequentially and returns results', async () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const handler = createMockHandler('Handler', ['config', 'command']);
    const plan = createBatchPlan(entries, [handler]);

    // Override actions to ensure they're actionable
    plan[0].action = 'apply';
    plan[1].action = 'try_command';
    plan[0].handler = handler;
    plan[1].handler = handler;

    const result = await executeBatchSequential(plan);

    assert.strictEqual(result.successful.length, 2);
    assert.strictEqual(result.failed.length, 0);
    assert.strictEqual(result.skipped.length, 0);
  });

  it('skips items without handlers', async () => {
    const entries = [createMockEntry('config')];
    const plan = createBatchPlan(entries, []); // No handlers
    plan[0].action = 'apply'; // Make it actionable

    const result = await executeBatchSequential(plan);

    assert.strictEqual(result.successful.length, 0);
    assert.strictEqual(result.skipped.length, 1);
  });

  it('stops on error when stopOnError is true', async () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('command'),
      createMockEntry('tool'),
    ];
    const failingHandler = createMockHandler('FailHandler', ['config', 'command', 'tool'], false);
    const plan = createBatchPlan(entries, [failingHandler]);

    // Make all actionable
    for (const item of plan) {
      item.action = 'apply';
      item.handler = failingHandler;
    }

    const result = await executeBatchSequential(plan, true);

    assert.strictEqual(result.failed.length, 1);
    assert.strictEqual(result.skipped.length, 2); // Remaining items skipped
  });

  it('continues on error when stopOnError is false', async () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('command'),
    ];
    const failingHandler = createMockHandler('FailHandler', ['config', 'command'], false);
    const plan = createBatchPlan(entries, [failingHandler]);

    for (const item of plan) {
      item.action = 'apply';
      item.handler = failingHandler;
    }

    const result = await executeBatchSequential(plan, false);

    assert.strictEqual(result.failed.length, 2);
    assert.strictEqual(result.skipped.length, 0);
  });

  it('handles thrown exceptions', async () => {
    const entries = [createMockEntry('config')];
    const throwingHandler = createFailingHandler('ThrowHandler', ['config']);
    const plan: BatchAction[] = [{
      entry: entries[0],
      action: 'apply',
      handler: throwingHandler,
    }];

    const result = await executeBatchSequential(plan);

    assert.strictEqual(result.failed.length, 1);
    assert.ok(result.failed[0].error.includes('threw an exception'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: executeBatchParallel
// ─────────────────────────────────────────────────────────────────────────────

describe('executeBatchParallel', () => {
  it('executes all actions in parallel', async () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const handler = createMockHandler('Handler', ['config', 'command']);
    const plan: BatchAction[] = entries.map(entry => ({
      entry,
      action: 'apply',
      handler,
    }));

    const result = await executeBatchParallel(plan);

    assert.strictEqual(result.successful.length, 2);
  });

  it('separates skipped items before parallel execution', async () => {
    const entries = [
      createMockEntry('config'),
      createMockEntry('fix'), // Will be skipped (acknowledge action)
    ];
    const handler = createMockHandler('Handler', ['config']);
    const plan = createBatchPlan(entries, [handler]);

    const result = await executeBatchParallel(plan);

    assert.strictEqual(result.successful.length, 1);
    assert.strictEqual(result.skipped.length, 1);
  });

  it('collects all failures when multiple actions fail', async () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const failHandler = createMockHandler('FailHandler', ['config', 'command'], false);
    const plan: BatchAction[] = entries.map(entry => ({
      entry,
      action: 'apply',
      handler: failHandler,
    }));

    const result = await executeBatchParallel(plan);

    assert.strictEqual(result.failed.length, 2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: executeBatch (main entry point)
// ─────────────────────────────────────────────────────────────────────────────

describe('executeBatch', () => {
  it('returns all items as skipped in dry run mode', async () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const handler = createMockHandler('Handler', ['config', 'command']);
    const plan = createBatchPlan(entries, [handler]);

    const result = await executeBatch(plan, { dryRun: true });

    assert.strictEqual(result.skipped.length, 2);
    assert.strictEqual(result.successful.length, 0);
    assert.strictEqual(result.failed.length, 0);
  });

  it('uses sequential execution by default', async () => {
    const entries = [createMockEntry('config')];
    const handler = createMockHandler('Handler', ['config']);
    const plan: BatchAction[] = [{
      entry: entries[0],
      action: 'apply',
      handler,
    }];

    const result = await executeBatch(plan, { parallel: false });

    assert.strictEqual(result.successful.length, 1);
  });

  it('uses parallel execution when parallel option is true', async () => {
    const entries = [createMockEntry('config'), createMockEntry('command')];
    const handler = createMockHandler('Handler', ['config', 'command']);
    const plan: BatchAction[] = entries.map(entry => ({
      entry,
      action: 'apply',
      handler,
    }));

    const result = await executeBatch(plan, { parallel: true });

    assert.strictEqual(result.successful.length, 2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: getBatchStats
// ─────────────────────────────────────────────────────────────────────────────

describe('getBatchStats', () => {
  it('calculates correct statistics', () => {
    const result: BatchResult = {
      successful: [
        { entry: createMockEntry('config'), action: 'apply', handler: null },
        { entry: createMockEntry('command'), action: 'try_command', handler: null },
      ],
      failed: [
        { action: { entry: createMockEntry('breaking'), action: 'view_migration', handler: null }, error: 'test' },
      ],
      skipped: [
        { entry: createMockEntry('fix'), action: 'acknowledge', handler: null },
        { entry: createMockEntry('improvement'), action: 'acknowledge', handler: null },
        { entry: createMockEntry('tool'), action: 'learn_more', handler: null },
      ],
    };

    const stats = getBatchStats(result);

    assert.strictEqual(stats.total, 6);
    assert.strictEqual(stats.success, 2);
    assert.strictEqual(stats.failed, 1);
    assert.strictEqual(stats.skipped, 3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatBatchStats
// ─────────────────────────────────────────────────────────────────────────────

describe('formatBatchStats', () => {
  it('formats all non-zero stats', () => {
    const stats = { total: 10, success: 5, failed: 2, skipped: 3 };

    const formatted = formatBatchStats(stats);

    assert.ok(formatted.includes('5 successful'));
    assert.ok(formatted.includes('2 failed'));
    assert.ok(formatted.includes('3 skipped'));
    assert.ok(formatted.includes('10 total'));
  });

  it('omits zero stats', () => {
    const stats = { total: 5, success: 5, failed: 0, skipped: 0 };

    const formatted = formatBatchStats(stats);

    assert.ok(formatted.includes('5 successful'));
    assert.ok(!formatted.includes('failed'));
    assert.ok(!formatted.includes('skipped'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatBatchResult
// ─────────────────────────────────────────────────────────────────────────────

describe('formatBatchResult', () => {
  it('formats markdown report with all sections', () => {
    const result: BatchResult = {
      successful: [
        { entry: createMockEntry('config', 'Applied config change'), action: 'apply', handler: null },
      ],
      failed: [
        { action: { entry: createMockEntry('command', 'Failed command'), action: 'try_command', handler: null }, error: 'Command not found' },
      ],
      skipped: [
        { entry: createMockEntry('fix', 'Skipped fix'), action: 'acknowledge', handler: null },
      ],
    };

    const formatted = formatBatchResult(result);

    assert.ok(formatted.includes('## Batch Execution Report'));
    assert.ok(formatted.includes('### Successful'));
    assert.ok(formatted.includes('### Failed'));
    assert.ok(formatted.includes('### Skipped'));
    assert.ok(formatted.includes('Applied config'));
    assert.ok(formatted.includes('Command not found'));
    assert.ok(formatted.includes('Skipped fix'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: hasBatchFailures / isBatchSuccess
// ─────────────────────────────────────────────────────────────────────────────

describe('hasBatchFailures', () => {
  it('returns true when there are failures', () => {
    const result: BatchResult = {
      successful: [],
      failed: [{ action: { entry: createMockEntry('config'), action: 'apply', handler: null }, error: 'test' }],
      skipped: [],
    };

    assert.strictEqual(hasBatchFailures(result), true);
  });

  it('returns false when there are no failures', () => {
    const result: BatchResult = {
      successful: [{ entry: createMockEntry('config'), action: 'apply', handler: null }],
      failed: [],
      skipped: [],
    };

    assert.strictEqual(hasBatchFailures(result), false);
  });
});

describe('isBatchSuccess', () => {
  it('returns true when no failures', () => {
    const result: BatchResult = {
      successful: [{ entry: createMockEntry('config'), action: 'apply', handler: null }],
      failed: [],
      skipped: [{ entry: createMockEntry('fix'), action: 'acknowledge', handler: null }],
    };

    assert.strictEqual(isBatchSuccess(result), true);
  });

  it('returns false when there are failures', () => {
    const result: BatchResult = {
      successful: [],
      failed: [{ action: { entry: createMockEntry('config'), action: 'apply', handler: null }, error: 'test' }],
      skipped: [],
    };

    assert.strictEqual(isBatchSuccess(result), false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration: Full batch workflow', () => {
  it('complete workflow: create plan -> filter -> preview -> execute -> stats', async () => {
    const entries = [
      createMockEntry('config', 'Add new CLAUDE_API_KEY env var'),
      createMockEntry('command', 'New /status command available'),
      createMockEntry('breaking', 'Removed deprecated --old-flag'),
      createMockEntry('fix', 'Fixed crash on startup'),
      createMockEntry('improvement', 'Improved performance by 50%'),
    ];

    const configHandler = createMockHandler('ConfigHandler', ['config']);
    const commandHandler = createMockHandler('CommandHandler', ['command']);
    const migrationHandler = createMockHandler('MigrationHandler', ['breaking']);

    // Step 1: Create plan
    const plan = createBatchPlan(entries, [configHandler, commandHandler, migrationHandler]);
    assert.strictEqual(plan.length, 5);

    // Step 2: Filter to actionable only
    const actionablePlan = filterPlanToActionable(plan);
    assert.strictEqual(actionablePlan.length, 3); // config, command, breaking

    // Step 3: Preview
    const preview = previewBatch(actionablePlan);
    const willExecute = preview.filter(p => p.willExecute);
    assert.strictEqual(willExecute.length, 3);

    // Step 4: Execute
    const result = await executeBatch(actionablePlan, { parallel: false });
    assert.strictEqual(result.successful.length, 3);
    assert.strictEqual(result.failed.length, 0);

    // Step 5: Get stats
    const stats = getBatchStats(result);
    assert.strictEqual(stats.success, 3);
    assert.strictEqual(stats.total, 3);

    // Verify success
    assert.strictEqual(isBatchSuccess(result), true);
  });

  it('handles mixed success and failure gracefully', async () => {
    const entries = [
      createMockEntry('config', 'Good config'),
      createMockEntry('command', 'Bad command'),
      createMockEntry('tool', 'Good tool'),
    ];

    const goodHandler = createMockHandler('GoodHandler', ['config', 'tool']);
    const badHandler = createMockHandler('BadHandler', ['command'], false);

    const plan: BatchAction[] = [
      { entry: entries[0], action: 'apply', handler: goodHandler },
      { entry: entries[1], action: 'try_command', handler: badHandler },
      { entry: entries[2], action: 'learn_more', handler: goodHandler },
    ];

    const result = await executeBatch(plan, { parallel: false, stopOnError: false });

    assert.strictEqual(result.successful.length, 2);
    assert.strictEqual(result.failed.length, 1);
    assert.strictEqual(hasBatchFailures(result), true);
    assert.strictEqual(isBatchSuccess(result), false);
  });
});

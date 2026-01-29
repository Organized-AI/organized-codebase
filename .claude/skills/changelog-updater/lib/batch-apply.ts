/**
 * Batch Apply Mode (feat-011)
 *
 * Provides batch operations for applying multiple changelog actions at once.
 * Supports dry-run, sequential, and parallel execution modes.
 */

import type { ParsedEntry, EntryCategory } from './entry-parser';
import type { ActionHandler, ActionResult } from './action-router';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface BatchAction {
  entry: ParsedEntry;
  action: UserAction;
  handler: ActionHandler | null;
}

export interface BatchResult {
  successful: BatchAction[];
  failed: Array<{ action: BatchAction; error: string }>;
  skipped: BatchAction[];
}

export interface BatchOptions {
  dryRun: boolean;
  stopOnError: boolean;
  parallel: boolean;
}

export interface BatchStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Options
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_BATCH_OPTIONS: BatchOptions = {
  dryRun: false,
  stopOnError: false,
  parallel: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// Plan Creation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Actions that don't require a handler (just acknowledgments)
 */
const NO_HANDLER_ACTIONS: UserAction[] = [
  'acknowledge',
  'acknowledge_all',
  'skip',
  'dismiss',
];

/**
 * Check if an action requires a handler to execute
 */
function actionRequiresHandler(action: UserAction): boolean {
  return !NO_HANDLER_ACTIONS.includes(action);
}

/**
 * Find the appropriate handler for an entry and action
 */
function findMatchingHandler(
  entry: ParsedEntry,
  action: UserAction,
  handlers: ActionHandler[]
): ActionHandler | null {
  for (const handler of handlers) {
    if (handler.canHandle(entry, action)) {
      return handler;
    }
  }
  return null;
}

/**
 * Create a batch plan from entries and handlers
 *
 * Each entry is paired with its default/recommended action and
 * the handler that can execute it.
 */
export function createBatchPlan(
  entries: ParsedEntry[],
  handlers: ActionHandler[],
  actionOverrides?: Map<ParsedEntry, UserAction>
): BatchAction[] {
  const plan: BatchAction[] = [];

  for (const entry of entries) {
    // Determine action: use override if provided, otherwise use default based on category
    const action = actionOverrides?.get(entry) ?? getDefaultActionForEntry(entry);

    // Find handler if action requires one
    const handler = actionRequiresHandler(action)
      ? findMatchingHandler(entry, action, handlers)
      : null;

    plan.push({ entry, action, handler });
  }

  return plan;
}

/**
 * Get the default action for an entry based on its category
 */
function getDefaultActionForEntry(entry: ParsedEntry): UserAction {
  switch (entry.category) {
    case 'config':
      return 'apply';
    case 'command':
      return 'try_command';
    case 'breaking':
      return 'view_migration';
    case 'architecture':
    case 'tool':
      return 'learn_more';
    case 'fix':
    case 'improvement':
      return 'acknowledge';
    default:
      return 'acknowledge';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Filtering
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter batch plan by categories
 */
export function filterPlanByCategory(
  plan: BatchAction[],
  categories: EntryCategory[]
): BatchAction[] {
  const categorySet = new Set(categories);
  return plan.filter(item => categorySet.has(item.entry.category));
}

/**
 * Filter batch plan by action types
 */
export function filterPlanByAction(
  plan: BatchAction[],
  actions: UserAction[]
): BatchAction[] {
  const actionSet = new Set(actions);
  return plan.filter(item => actionSet.has(item.action));
}

/**
 * Filter plan to only actionable items (those requiring handlers)
 */
export function filterPlanToActionable(plan: BatchAction[]): BatchAction[] {
  return plan.filter(item => actionRequiresHandler(item.action));
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview / Dry Run
// ─────────────────────────────────────────────────────────────────────────────

export interface BatchPreviewItem {
  entry: ParsedEntry;
  action: UserAction;
  willExecute: boolean;
  reason: string;
}

/**
 * Preview what a batch execution would do without actually running it
 */
export function previewBatch(plan: BatchAction[]): BatchPreviewItem[] {
  return plan.map(item => {
    const requiresHandler = actionRequiresHandler(item.action);

    if (!requiresHandler) {
      return {
        entry: item.entry,
        action: item.action,
        willExecute: false,
        reason: `Action "${item.action}" is an acknowledgment and requires no execution`,
      };
    }

    if (!item.handler) {
      return {
        entry: item.entry,
        action: item.action,
        willExecute: false,
        reason: `No handler registered for action "${item.action}" on category "${item.entry.category}"`,
      };
    }

    return {
      entry: item.entry,
      action: item.action,
      willExecute: true,
      reason: `Handler "${item.handler.describe()}" will execute "${item.action}"`,
    };
  });
}

/**
 * Format preview as human-readable text
 */
export function formatPreview(preview: BatchPreviewItem[]): string {
  const lines: string[] = [];

  lines.push('Batch Execution Preview');
  lines.push('========================');
  lines.push('');

  const willExecute = preview.filter(p => p.willExecute);
  const willSkip = preview.filter(p => !p.willExecute);

  if (willExecute.length > 0) {
    lines.push(`Will Execute (${willExecute.length}):`);
    for (const item of willExecute) {
      const content = item.entry.original.content.substring(0, 50);
      lines.push(`  [${item.action}] ${content}...`);
      lines.push(`    -> ${item.reason}`);
    }
    lines.push('');
  }

  if (willSkip.length > 0) {
    lines.push(`Will Skip (${willSkip.length}):`);
    for (const item of willSkip) {
      const content = item.entry.original.content.substring(0, 50);
      lines.push(`  [${item.action}] ${content}...`);
      lines.push(`    -> ${item.reason}`);
    }
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution - Sequential
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute batch plan sequentially (one at a time)
 */
export async function executeBatchSequential(
  plan: BatchAction[],
  stopOnError: boolean = false
): Promise<BatchResult> {
  const result: BatchResult = {
    successful: [],
    failed: [],
    skipped: [],
  };

  for (const item of plan) {
    // Skip acknowledgment actions
    if (!actionRequiresHandler(item.action)) {
      result.skipped.push(item);
      continue;
    }

    // No handler available
    if (!item.handler) {
      result.skipped.push(item);
      continue;
    }

    try {
      const actionResult = await item.handler.execute(item.entry, item.action);

      if (actionResult.success) {
        result.successful.push(item);
      } else {
        result.failed.push({
          action: item,
          error: (actionResult as { error: string }).error,
        });

        if (stopOnError) {
          // Mark remaining items as skipped
          const remainingIndex = plan.indexOf(item) + 1;
          for (let i = remainingIndex; i < plan.length; i++) {
            result.skipped.push(plan[i]);
          }
          break;
        }
      }
    } catch (error) {
      result.failed.push({
        action: item,
        error: error instanceof Error ? error.message : String(error),
      });

      if (stopOnError) {
        const remainingIndex = plan.indexOf(item) + 1;
        for (let i = remainingIndex; i < plan.length; i++) {
          result.skipped.push(plan[i]);
        }
        break;
      }
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution - Parallel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute batch plan in parallel using Promise.allSettled
 */
export async function executeBatchParallel(
  plan: BatchAction[]
): Promise<BatchResult> {
  const result: BatchResult = {
    successful: [],
    failed: [],
    skipped: [],
  };

  // Separate items that need execution from those that don't
  const toExecute: BatchAction[] = [];
  const toSkip: BatchAction[] = [];

  for (const item of plan) {
    if (!actionRequiresHandler(item.action) || !item.handler) {
      toSkip.push(item);
    } else {
      toExecute.push(item);
    }
  }

  result.skipped = toSkip;

  // Execute all in parallel
  const promises = toExecute.map(async item => {
    const actionResult = await item.handler!.execute(item.entry, item.action);
    return { item, actionResult };
  });

  const settled = await Promise.allSettled(promises);

  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') {
      const { item, actionResult } = outcome.value;
      if (actionResult.success) {
        result.successful.push(item);
      } else {
        result.failed.push({
          action: item,
          error: (actionResult as { error: string }).error,
        });
      }
    } else {
      // Promise rejected
      const error = outcome.reason;
      // Find the corresponding item (this is tricky with allSettled)
      // We need to track which promise corresponds to which item
      result.failed.push({
        action: toExecute[settled.indexOf(outcome)],
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Execution Entry Point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Execute a batch plan with the given options
 */
export async function executeBatch(
  plan: BatchAction[],
  options: Partial<BatchOptions> = {}
): Promise<BatchResult> {
  const mergedOptions = { ...DEFAULT_BATCH_OPTIONS, ...options };

  // Dry run - just return what would happen
  if (mergedOptions.dryRun) {
    const result: BatchResult = {
      successful: [],
      failed: [],
      skipped: [...plan], // In dry run, everything is "skipped" (not executed)
    };
    return result;
  }

  // Execute based on parallel option
  if (mergedOptions.parallel) {
    return executeBatchParallel(plan);
  }

  return executeBatchSequential(plan, mergedOptions.stopOnError);
}

// ─────────────────────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get statistics from a batch result
 */
export function getBatchStats(result: BatchResult): BatchStats {
  return {
    total: result.successful.length + result.failed.length + result.skipped.length,
    success: result.successful.length,
    failed: result.failed.length,
    skipped: result.skipped.length,
  };
}

/**
 * Format batch stats as a summary string
 */
export function formatBatchStats(stats: BatchStats): string {
  const parts: string[] = [];

  if (stats.success > 0) {
    parts.push(`${stats.success} successful`);
  }
  if (stats.failed > 0) {
    parts.push(`${stats.failed} failed`);
  }
  if (stats.skipped > 0) {
    parts.push(`${stats.skipped} skipped`);
  }

  return `Batch complete: ${parts.join(', ')} (${stats.total} total)`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Result Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format batch result as markdown report
 */
export function formatBatchResult(result: BatchResult): string {
  const lines: string[] = [];
  const stats = getBatchStats(result);

  lines.push('## Batch Execution Report');
  lines.push('');
  lines.push(`**Total:** ${stats.total}`);
  lines.push(`**Successful:** ${stats.success}`);
  lines.push(`**Failed:** ${stats.failed}`);
  lines.push(`**Skipped:** ${stats.skipped}`);
  lines.push('');

  if (result.successful.length > 0) {
    lines.push('### Successful');
    lines.push('');
    for (const item of result.successful) {
      const content = item.entry.original.content.substring(0, 60);
      lines.push(`- [${item.action}] ${content}...`);
    }
    lines.push('');
  }

  if (result.failed.length > 0) {
    lines.push('### Failed');
    lines.push('');
    for (const { action: item, error } of result.failed) {
      const content = item.entry.original.content.substring(0, 40);
      lines.push(`- [${item.action}] ${content}...`);
      lines.push(`  - Error: ${error}`);
    }
    lines.push('');
  }

  if (result.skipped.length > 0) {
    lines.push('### Skipped');
    lines.push('');
    for (const item of result.skipped) {
      const content = item.entry.original.content.substring(0, 60);
      lines.push(`- [${item.action}] ${content}...`);
    }
  }

  return lines.join('\n');
}

/**
 * Check if batch result has any failures
 */
export function hasBatchFailures(result: BatchResult): boolean {
  return result.failed.length > 0;
}

/**
 * Check if batch execution was fully successful (no failures)
 */
export function isBatchSuccess(result: BatchResult): boolean {
  return result.failed.length === 0;
}

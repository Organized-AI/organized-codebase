/**
 * Action Router (feat-004)
 *
 * Routes user action choices to appropriate handlers.
 * Coordinates between presentation layer and execution handlers.
 */

import type { ParsedEntry, ActionType, EntryCategory } from './entry-parser';
import type { UserAction, PresentationGroup } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActionResult =
  | { success: true; message: string; details?: Record<string, unknown> }
  | { success: false; error: string; recoverable: boolean };

export interface ActionHandler {
  canHandle(entry: ParsedEntry, action: UserAction): boolean;
  execute(entry: ParsedEntry, action: UserAction): Promise<ActionResult>;
  describe(): string;
}

export interface ActionContext {
  projectRoot: string;
  dryRun: boolean;
  interactive: boolean;
}

export interface ExecutionPlan {
  entries: ParsedEntry[];
  actions: Map<string, UserAction>; // entryId -> action
  context: ActionContext;
}

export interface ExecutionReport {
  totalEntries: number;
  successful: number;
  failed: number;
  skipped: number;
  results: Array<{
    entryId: string;
    entry: ParsedEntry;
    action: UserAction;
    result: ActionResult;
  }>;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler Registry
// ─────────────────────────────────────────────────────────────────────────────

const handlers: ActionHandler[] = [];

/**
 * Register an action handler
 */
export function registerHandler(handler: ActionHandler): void {
  handlers.push(handler);
}

/**
 * Find handler for an entry and action
 */
export function findHandler(entry: ParsedEntry, action: UserAction): ActionHandler | null {
  for (const handler of handlers) {
    if (handler.canHandle(entry, action)) {
      return handler;
    }
  }
  return null;
}

/**
 * List all registered handlers
 */
export function listHandlers(): string[] {
  return handlers.map(h => h.describe());
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Routing Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Map user action to handler type
 */
export function getHandlerTypeForAction(action: UserAction): string {
  switch (action) {
    case 'apply':
      return 'config';
    case 'try_command':
      return 'command';
    case 'view_migration':
      return 'migration';
    case 'learn_more':
    case 'acknowledge':
    case 'acknowledge_all':
      return 'awareness';
    case 'skip':
    case 'dismiss':
      return 'skip';
    case 'apply_all':
      return 'batch';
    case 'review_one_by_one':
      return 'interactive';
    default:
      return 'unknown';
  }
}

/**
 * Determine if an action requires a handler or is just acknowledgment
 */
export function requiresHandler(action: UserAction): boolean {
  const noHandlerActions: UserAction[] = [
    'acknowledge',
    'acknowledge_all',
    'skip',
    'dismiss',
  ];
  return !noHandlerActions.includes(action);
}

/**
 * Get default action for an entry based on its category
 */
export function getDefaultAction(entry: ParsedEntry): UserAction {
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

/**
 * Get recommended action based on entry analysis
 */
export function getRecommendedAction(entry: ParsedEntry): {
  action: UserAction;
  reason: string;
} {
  const details = entry.extractedDetails;

  // Config entries with env vars → suggest apply
  if (entry.category === 'config' && details.envVars?.length) {
    return {
      action: 'apply',
      reason: `Add ${details.envVars[0]} to your environment`,
    };
  }

  // Command entries → suggest try
  if (entry.category === 'command' && details.commands?.length) {
    return {
      action: 'try_command',
      reason: `Try the new ${details.commands[0]} command`,
    };
  }

  // Breaking changes → always show migration
  if (entry.category === 'breaking') {
    return {
      action: 'view_migration',
      reason: 'Review required changes to your workflow',
    };
  }

  // Default to awareness
  return {
    action: 'acknowledge',
    reason: 'No action required',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Execution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique ID for an entry
 */
export function getEntryId(entry: ParsedEntry): string {
  const content = entry.original.content;
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${entry.original.version}-${Math.abs(hash).toString(36).substring(0, 8)}`;
}

/**
 * Create an execution plan from groups and user choices
 */
export function createExecutionPlan(
  groups: PresentationGroup[],
  userChoices: Map<string, UserAction>,
  context: ActionContext
): ExecutionPlan {
  const entries: ParsedEntry[] = [];
  const actions = new Map<string, UserAction>();

  for (const group of groups) {
    for (const entry of group.entries) {
      const entryId = getEntryId(entry);
      entries.push(entry);

      // Use user choice if provided, otherwise use default
      const action = userChoices.get(entryId) ?? getDefaultAction(entry);
      actions.set(entryId, action);
    }
  }

  return { entries, actions, context };
}

/**
 * Execute an action plan
 */
export async function executePlan(plan: ExecutionPlan): Promise<ExecutionReport> {
  const report: ExecutionReport = {
    totalEntries: plan.entries.length,
    successful: 0,
    failed: 0,
    skipped: 0,
    results: [],
    timestamp: new Date().toISOString(),
  };

  for (const entry of plan.entries) {
    const entryId = getEntryId(entry);
    const action = plan.actions.get(entryId) ?? 'skip';

    // Skip actions don't need execution
    if (!requiresHandler(action)) {
      report.skipped++;
      report.results.push({
        entryId,
        entry,
        action,
        result: { success: true, message: `Acknowledged: ${action}` },
      });
      continue;
    }

    // Find and execute handler
    const handler = findHandler(entry, action);

    if (!handler) {
      // No handler registered - this is expected during development
      if (plan.context.dryRun) {
        report.results.push({
          entryId,
          entry,
          action,
          result: { success: true, message: `[DRY RUN] Would execute: ${action}` },
        });
        report.successful++;
      } else {
        report.results.push({
          entryId,
          entry,
          action,
          result: {
            success: false,
            error: `No handler registered for action: ${action}`,
            recoverable: true,
          },
        });
        report.failed++;
      }
      continue;
    }

    try {
      const result = await handler.execute(entry, action);
      report.results.push({ entryId, entry, action, result });

      if (result.success) {
        report.successful++;
      } else {
        report.failed++;
      }
    } catch (error) {
      report.results.push({
        entryId,
        entry,
        action,
        result: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          recoverable: false,
        },
      });
      report.failed++;
    }
  }

  return report;
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply all recommended actions
 */
export function createApplyAllPlan(
  groups: PresentationGroup[],
  context: ActionContext
): ExecutionPlan {
  const entries: ParsedEntry[] = [];
  const actions = new Map<string, UserAction>();

  for (const group of groups) {
    for (const entry of group.entries) {
      const entryId = getEntryId(entry);
      entries.push(entry);

      // Use recommended action for each entry
      const { action } = getRecommendedAction(entry);
      actions.set(entryId, action);
    }
  }

  return { entries, actions, context };
}

/**
 * Acknowledge all non-actionable entries
 */
export function createAcknowledgeAllPlan(
  groups: PresentationGroup[],
  context: ActionContext
): ExecutionPlan {
  const entries: ParsedEntry[] = [];
  const actions = new Map<string, UserAction>();

  for (const group of groups) {
    // Only include groups that don't require action
    if (!group.requiresAction) {
      for (const entry of group.entries) {
        const entryId = getEntryId(entry);
        entries.push(entry);
        actions.set(entryId, 'acknowledge');
      }
    }
  }

  return { entries, actions, context };
}

// ─────────────────────────────────────────────────────────────────────────────
// Report Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format execution report as markdown
 */
export function formatReport(report: ExecutionReport): string {
  const lines: string[] = [];

  lines.push('## Changelog Update Report');
  lines.push('');
  lines.push(`**Date:** ${report.timestamp}`);
  lines.push(`**Total entries:** ${report.totalEntries}`);
  lines.push(`**Successful:** ${report.successful}`);
  lines.push(`**Failed:** ${report.failed}`);
  lines.push(`**Skipped:** ${report.skipped}`);
  lines.push('');

  if (report.results.some(r => r.result.success && r.action !== 'skip')) {
    lines.push('### Applied Changes');
    lines.push('');
    for (const r of report.results) {
      if (r.result.success && r.action !== 'skip' && r.action !== 'acknowledge') {
        lines.push(`- ✓ **${r.action}**: ${r.entry.original.content.substring(0, 60)}...`);
      }
    }
    lines.push('');
  }

  if (report.results.some(r => !r.result.success)) {
    lines.push('### Failed Actions');
    lines.push('');
    for (const r of report.results) {
      if (!r.result.success) {
        const error = r.result as { error: string };
        lines.push(`- ✗ **${r.action}**: ${error.error}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Get summary line for report
 */
export function getReportSummary(report: ExecutionReport): string {
  if (report.failed > 0) {
    return `⚠️ ${report.successful} applied, ${report.failed} failed, ${report.skipped} skipped`;
  }
  if (report.successful > 0) {
    return `✅ ${report.successful} changes applied, ${report.skipped} acknowledged`;
  }
  return `📋 ${report.skipped} entries acknowledged`;
}

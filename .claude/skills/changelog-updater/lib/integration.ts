/**
 * Changelog-Tracker Integration (feat-010)
 *
 * Integrates with changelog-tracker skill to provide seamless
 * update checking, parsing, presentation, and tracking workflow.
 */

import * as fs from 'fs';
import * as path from 'path';

import {
  detectDiff,
  extractMetadata,
  loadState,
  saveState,
  getStatePath,
  type DiffResult,
  type ChangelogEntry,
  type UpdaterState,
} from './diff-detector';

import {
  parseEntries,
  groupByCategory,
  getActionableEntries,
  getSummaryStats,
  type ParsedEntry,
  type EntryCategory,
} from './entry-parser';

import {
  loadAckStore,
  saveAckStore,
  createAckTracker,
  getUnacknowledged,
  generateEntryId,
  acknowledge,
  acknowledgeMany,
  type AckStore,
  type AckTracker,
  type AcknowledgmentStatus,
} from './ack-tracker';

import {
  createExecutionPlan,
  executePlan,
  getEntryId,
  formatReport,
  getReportSummary,
  type ActionHandler,
  type ActionContext,
  type ExecutionReport,
} from './action-router';

import {
  groupEntriesByCategory,
  formatUpdateSummary,
  buildSummaryQuestion,
  getActionableCount,
  hasBreakingChanges,
  type PresentationGroup,
  type UserAction,
} from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface IntegrationConfig {
  /** Path to the changelog markdown file */
  changelogPath: string;
  /** Path to store acknowledgment state */
  ackStorePath: string;
  /** Enable automatic update checking */
  autoCheck: boolean;
}

export interface UpdateCheckResult {
  /** Whether new updates are available */
  hasUpdates: boolean;
  /** Parsed entries that are new */
  newEntries: ParsedEntry[];
  /** Version user last acknowledged */
  fromVersion: string | null;
  /** Latest version available */
  toVersion: string;
}

export interface IntegrationHooks {
  /** Called when new updates are detected */
  onNewUpdates?: (result: UpdateCheckResult) => void;
  /** Called when an error occurs */
  onError?: (err: Error) => void;
  /** Called before processing entries */
  onBeforeProcess?: (entries: ParsedEntry[]) => void;
  /** Called after processing completes */
  onAfterProcess?: (report: ExecutionReport) => void;
}

export interface UpdateCycleOptions {
  /** Run in dry-run mode (no actual changes) */
  dryRun?: boolean;
  /** Enable interactive mode */
  interactive?: boolean;
  /** Custom action handlers */
  handlers?: ActionHandler[];
}

export interface Integration {
  /** Check for new changelog updates */
  checkForUpdates: () => Promise<UpdateCheckResult>;
  /** Process entries with specified action handlers */
  processUpdates: (
    entries: ParsedEntry[],
    userChoices: Map<string, UserAction>,
    options?: UpdateCycleOptions
  ) => Promise<ExecutionReport>;
  /** Run full update cycle */
  runUpdateCycle: (options?: UpdateCycleOptions) => Promise<UpdateCycleResult>;
  /** Get acknowledgment tracker instance */
  getTracker: () => AckTracker;
  /** Get current configuration */
  getConfig: () => IntegrationConfig;
  /** Get presentation groups for entries */
  getGroups: (entries: ParsedEntry[]) => PresentationGroup[];
  /** Format entries as update summary */
  formatSummary: (
    entries: ParsedEntry[],
    fromVersion: string | null,
    toVersion: string
  ) => string;
}

export interface UpdateCycleResult {
  /** Whether updates were found */
  hasUpdates: boolean;
  /** Check result details */
  checkResult: UpdateCheckResult;
  /** Presentation groups */
  groups: PresentationGroup[];
  /** Execution report (if processed) */
  report?: ExecutionReport;
  /** Summary message */
  summary: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Configuration
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CHANGELOG_FILENAME = 'claude-code-changelog.md';
const DEFAULT_ACK_STORE_FILENAME = 'changelog-ack-store.json';

// ─────────────────────────────────────────────────────────────────────────────
// Path Resolution
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get default changelog path for a project
 * Checks multiple common locations
 */
export function getChangelogPath(projectRoot: string): string | null {
  const searchPaths = [
    path.join(projectRoot, 'DOCUMENTATION', DEFAULT_CHANGELOG_FILENAME),
    path.join(projectRoot, 'docs', DEFAULT_CHANGELOG_FILENAME),
    path.join(projectRoot, DEFAULT_CHANGELOG_FILENAME),
    path.join(projectRoot, '.claude', DEFAULT_CHANGELOG_FILENAME),
  ];

  for (const searchPath of searchPaths) {
    if (fs.existsSync(searchPath)) {
      return searchPath;
    }
  }

  return null;
}

/**
 * Get default ack store path for a project
 */
export function getAckStorePath(projectRoot: string): string {
  return path.join(projectRoot, '.claude', DEFAULT_ACK_STORE_FILENAME);
}

/**
 * Resolve project root from current working directory
 */
export function resolveProjectRoot(startPath?: string): string {
  let current = startPath || process.cwd();

  // Look for .claude directory or package.json as project root indicators
  while (current !== path.dirname(current)) {
    if (
      fs.existsSync(path.join(current, '.claude')) ||
      fs.existsSync(path.join(current, 'package.json')) ||
      fs.existsSync(path.join(current, '.git'))
    ) {
      return current;
    }
    current = path.dirname(current);
  }

  // Fallback to start path
  return startPath || process.cwd();
}

// ─────────────────────────────────────────────────────────────────────────────
// Core Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check for changelog updates against acknowledged state
 */
export async function checkForUpdates(
  changelogPath: string,
  ackStore: AckStore
): Promise<UpdateCheckResult> {
  // Validate changelog exists
  if (!fs.existsSync(changelogPath)) {
    throw new Error(`Changelog not found at: ${changelogPath}`);
  }

  // Read and parse changelog
  const content = fs.readFileSync(changelogPath, 'utf-8');
  const metadata = extractMetadata(content);

  // Create a minimal UpdaterState for diff detection
  const minimalState: UpdaterState = {
    lastAcknowledgedVersion: null,
    acknowledgedEntries: [],
    appliedConfigs: [],
    skippedEntries: [],
    lastChecked: new Date().toISOString(),
  };

  // Detect raw diff
  const diffResult = detectDiff(content, minimalState);

  // Parse entries for categorization
  const parsedEntries = parseEntries(diffResult.newEntries);

  // Filter to unacknowledged entries only
  const unacknowledged = getUnacknowledged(parsedEntries, ackStore);

  // Determine version range from acknowledged entries
  let fromVersion: string | null = null;
  const timestamps = Object.values(ackStore.records)
    .filter((r) => r.version)
    .sort((a, b) => b.timestamp - a.timestamp);

  if (timestamps.length > 0) {
    fromVersion = timestamps[0].version;
  }

  return {
    hasUpdates: unacknowledged.length > 0,
    newEntries: unacknowledged,
    fromVersion,
    toVersion: metadata.latestVersion,
  };
}

/**
 * Process updates with specified handlers and user choices
 */
export async function processUpdates(
  entries: ParsedEntry[],
  handlers: ActionHandler[],
  userChoices: Map<string, UserAction>,
  projectRoot: string,
  options: UpdateCycleOptions = {}
): Promise<ExecutionReport> {
  const { dryRun = false, interactive = false } = options;

  // Create action context
  const context: ActionContext = {
    projectRoot,
    dryRun,
    interactive,
  };

  // Group entries for processing
  const groups = groupEntriesByCategory(entries);

  // Create and execute plan
  const plan = createExecutionPlan(groups, userChoices, context);
  const report = await executePlan(plan);

  return report;
}

/**
 * Run complete update cycle: check -> parse -> present -> track
 */
export async function runUpdateCycle(
  config: IntegrationConfig,
  options: UpdateCycleOptions = {}
): Promise<UpdateCycleResult> {
  const { dryRun = false, interactive = false } = options;

  // Load ack store
  const ackStore = loadAckStore(config.ackStorePath);

  // Check for updates
  const checkResult = await checkForUpdates(config.changelogPath, ackStore);

  if (!checkResult.hasUpdates) {
    return {
      hasUpdates: false,
      checkResult,
      groups: [],
      summary: 'No new changelog updates available.',
    };
  }

  // Group entries for presentation
  const groups = groupEntriesByCategory(checkResult.newEntries);

  // Build summary message
  const actionable = getActionableCount(groups);
  const total = checkResult.newEntries.length;
  const hasBreaking = hasBreakingChanges(groups);

  let summary = `Found ${total} new changelog update${total === 1 ? '' : 's'}`;
  if (actionable > 0) {
    summary += ` (${actionable} actionable)`;
  }
  if (hasBreaking) {
    summary += ' including breaking changes';
  }
  summary += '.';

  return {
    hasUpdates: true,
    checkResult,
    groups,
    summary,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initialize updater for a project
 * Creates necessary directories and config files
 */
export function initializeUpdater(projectRoot: string): {
  config: IntegrationConfig;
  tracker: AckTracker;
  changelogFound: boolean;
} {
  // Ensure .claude directory exists
  const claudeDir = path.join(projectRoot, '.claude');
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Find changelog
  const changelogPath = getChangelogPath(projectRoot);
  const ackStorePath = getAckStorePath(projectRoot);

  const config: IntegrationConfig = {
    changelogPath: changelogPath || path.join(projectRoot, 'DOCUMENTATION', DEFAULT_CHANGELOG_FILENAME),
    ackStorePath,
    autoCheck: true,
  };

  // Create tracker
  const tracker = createAckTracker({ storePath: ackStorePath });

  return {
    config,
    tracker,
    changelogFound: changelogPath !== null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an integration instance with configuration and hooks
 */
export function createIntegration(
  config: IntegrationConfig,
  hooks?: IntegrationHooks
): Integration {
  // Create acknowledgment tracker
  const tracker = createAckTracker({ storePath: config.ackStorePath });

  // Derive project root from changelog path
  const projectRoot = resolveProjectRoot(path.dirname(config.changelogPath));

  return {
    /**
     * Check for new changelog updates
     */
    async checkForUpdates(): Promise<UpdateCheckResult> {
      try {
        const result = await checkForUpdates(config.changelogPath, tracker.getStore());

        if (result.hasUpdates && hooks?.onNewUpdates) {
          hooks.onNewUpdates(result);
        }

        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (hooks?.onError) {
          hooks.onError(err);
        }
        throw err;
      }
    },

    /**
     * Process updates with user choices
     */
    async processUpdates(
      entries: ParsedEntry[],
      userChoices: Map<string, UserAction>,
      options: UpdateCycleOptions = {}
    ): Promise<ExecutionReport> {
      try {
        if (hooks?.onBeforeProcess) {
          hooks.onBeforeProcess(entries);
        }

        const report = await processUpdates(
          entries,
          options.handlers || [],
          userChoices,
          projectRoot,
          options
        );

        // Update acknowledgment store based on results
        const store = tracker.getStore();
        const ackUpdates: Array<{
          entryId: string;
          status: AcknowledgmentStatus;
          version: string;
        }> = [];

        for (const result of report.results) {
          if (result.result.success) {
            const status: AcknowledgmentStatus =
              result.action === 'apply' ? 'applied' :
              result.action === 'skip' ? 'skipped' :
              result.action === 'dismiss' ? 'dismissed' : 'seen';

            ackUpdates.push({
              entryId: generateEntryId(result.entry),
              status,
              version: result.entry.original.version,
            });
          }
        }

        if (ackUpdates.length > 0) {
          const newStore = acknowledgeMany(store, ackUpdates);
          tracker.save(newStore);
        }

        if (hooks?.onAfterProcess) {
          hooks.onAfterProcess(report);
        }

        return report;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (hooks?.onError) {
          hooks.onError(err);
        }
        throw err;
      }
    },

    /**
     * Run full update cycle
     */
    async runUpdateCycle(options: UpdateCycleOptions = {}): Promise<UpdateCycleResult> {
      return runUpdateCycle(config, options);
    },

    /**
     * Get the acknowledgment tracker
     */
    getTracker(): AckTracker {
      return tracker;
    },

    /**
     * Get current configuration
     */
    getConfig(): IntegrationConfig {
      return { ...config };
    },

    /**
     * Get presentation groups for entries
     */
    getGroups(entries: ParsedEntry[]): PresentationGroup[] {
      return groupEntriesByCategory(entries);
    },

    /**
     * Format entries as update summary
     */
    formatSummary(
      entries: ParsedEntry[],
      fromVersion: string | null,
      toVersion: string
    ): string {
      const groups = groupEntriesByCategory(entries);
      return formatUpdateSummary(groups, fromVersion, toVersion);
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quick check if updates are available (minimal setup)
 */
export async function hasUpdatesAvailable(projectRoot: string): Promise<boolean> {
  const changelogPath = getChangelogPath(projectRoot);
  if (!changelogPath) {
    return false;
  }

  const ackStorePath = getAckStorePath(projectRoot);
  const ackStore = loadAckStore(ackStorePath);

  try {
    const result = await checkForUpdates(changelogPath, ackStore);
    return result.hasUpdates;
  } catch {
    return false;
  }
}

/**
 * Get update summary without full processing
 */
export async function getUpdateSummary(projectRoot: string): Promise<string | null> {
  const changelogPath = getChangelogPath(projectRoot);
  if (!changelogPath) {
    return null;
  }

  const config: IntegrationConfig = {
    changelogPath,
    ackStorePath: getAckStorePath(projectRoot),
    autoCheck: false,
  };

  const result = await runUpdateCycle(config, { dryRun: true });

  if (!result.hasUpdates) {
    return null;
  }

  return formatUpdateSummary(
    result.groups,
    result.checkResult.fromVersion,
    result.checkResult.toVersion
  );
}

/**
 * Acknowledge all current updates without processing
 */
export function acknowledgeAll(projectRoot: string): void {
  const ackStorePath = getAckStorePath(projectRoot);
  const tracker = createAckTracker({ storePath: ackStorePath });

  const changelogPath = getChangelogPath(projectRoot);
  if (!changelogPath || !fs.existsSync(changelogPath)) {
    return;
  }

  const content = fs.readFileSync(changelogPath, 'utf-8');
  const metadata = extractMetadata(content);

  // Create minimal state for diff detection
  const state: UpdaterState = {
    lastAcknowledgedVersion: null,
    acknowledgedEntries: [],
    appliedConfigs: [],
    skippedEntries: [],
    lastChecked: new Date().toISOString(),
  };

  const diffResult = detectDiff(content, state);
  const parsedEntries = parseEntries(diffResult.newEntries);

  // Acknowledge all entries as 'seen'
  const ackUpdates = parsedEntries.map((entry) => ({
    entryId: generateEntryId(entry),
    status: 'seen' as AcknowledgmentStatus,
    version: entry.original.version,
  }));

  if (ackUpdates.length > 0) {
    const newStore = acknowledgeMany(tracker.getStore(), ackUpdates);
    tracker.save(newStore);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export {
  // Re-export commonly used types
  type ParsedEntry,
  type EntryCategory,
  type AckStore,
  type AckTracker,
  type ActionHandler,
  type ExecutionReport,
  type PresentationGroup,
  type UserAction,
};

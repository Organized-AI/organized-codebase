/**
 * Migration Handler (feat-008)
 *
 * Generates migration guides for breaking changes detected in changelog entries.
 * Provides step-by-step instructions to help users adapt to changes.
 */

import type { ParsedEntry, EntryCategory } from './entry-parser';
import type { ActionHandler, ActionResult } from './action-router';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type BreakingChangeType = 'removed' | 'renamed' | 'changed' | 'deprecated';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface MigrationStep {
  order: number;
  title: string;
  description: string;
  automated: boolean;
}

export interface MigrationGuide {
  title: string;
  summary: string;
  severity: Severity;
  steps: MigrationStep[];
  estimatedEffort?: string;
}

export interface BreakingChangeInfo {
  type: BreakingChangeType;
  affectedArea: string;
  description: string;
}

export interface MigrationHandlerOptions {
  projectRoot: string;
  interactive: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Detection Patterns
// ─────────────────────────────────────────────────────────────────────────────

const BREAKING_CHANGE_PATTERNS: Record<BreakingChangeType, RegExp[]> = {
  removed: [
    /\bRemoved\b/i,
    /\bno\s+longer\s+(?:available|supported|works?)\b/i,
    /\bdiscontinued\b/i,
    /\bdeleted\b/i,
    /\bdropped\b/i,
  ],
  renamed: [
    /\brenamed?\b/i,
    /\bnow\s+called\b/i,
    /\bchanged?\s+(?:to|from)\b/i,
    /\breplaced\s+by\b/i,
    /\bis\s+now\b/i,
  ],
  changed: [
    /\bChanged\b/,
    /\bbehavior\s+change/i,
    /\bnow\s+(?:requires?|uses?|defaults?)\b/i,
    /\bdifferent(?:ly)?\b/i,
    /\bupdated\s+(?:default|behavior)\b/i,
  ],
  deprecated: [
    /\bdeprecated\b/i,
    /\bwill\s+be\s+removed\b/i,
    /\bscheduled\s+for\s+removal\b/i,
    /\bobsolete\b/i,
    /\blegacy\b/i,
  ],
};

const AFFECTED_AREA_PATTERNS: Array<{ pattern: RegExp; area: string }> = [
  { pattern: /\bAPI\b/i, area: 'API' },
  { pattern: /\bCLI\b/i, area: 'CLI' },
  { pattern: /\bconfig(?:uration)?\b/i, area: 'Configuration' },
  { pattern: /\bcommand\b/i, area: 'Commands' },
  { pattern: /\bMCP\b/i, area: 'MCP Integration' },
  { pattern: /\bplugin\b/i, area: 'Plugins' },
  { pattern: /\bhook\b/i, area: 'Hooks' },
  { pattern: /\bsettings?\b/i, area: 'Settings' },
  { pattern: /\benv(?:ironment)?\s*var(?:iable)?s?\b/i, area: 'Environment' },
  { pattern: /\bworkflow\b/i, area: 'Workflow' },
  { pattern: /\bUI\b/i, area: 'User Interface' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Detection Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect if an entry describes a breaking change and what type
 */
export function detectBreakingChange(entry: ParsedEntry): BreakingChangeInfo | null {
  const content = entry.original.content;
  const section = entry.original.section?.toLowerCase() || '';

  // Quick check: is this even a breaking change?
  if (entry.category !== 'breaking') {
    return null;
  }

  // Determine the type of breaking change
  // Priority order: deprecated > removed > renamed > changed
  // (more specific types should be detected first)
  const TYPE_PRIORITY: BreakingChangeType[] = ['deprecated', 'removed', 'renamed', 'changed'];

  let detectedType: BreakingChangeType | null = null;
  let highestScore = 0;

  for (const [type, patterns] of Object.entries(BREAKING_CHANGE_PATTERNS)) {
    let score = 0;

    // Check content patterns - each match adds 3 points
    for (const pattern of patterns) {
      if (pattern.test(content)) {
        score += 3;
      }
    }

    // Section header adds 2 points (less than content match)
    if (section === type || section === `${type}d`) {
      score += 2;
    }

    // Apply priority bonus for tie-breaking
    const priorityBonus = (TYPE_PRIORITY.length - TYPE_PRIORITY.indexOf(type as BreakingChangeType)) * 0.1;

    const finalScore = score + priorityBonus;

    if (finalScore > highestScore) {
      highestScore = finalScore;
      detectedType = type as BreakingChangeType;
    }
  }

  // Default to 'changed' if no specific type detected
  if (!detectedType) {
    detectedType = 'changed';
  }

  // Determine affected area
  let affectedArea = 'General';
  for (const { pattern, area } of AFFECTED_AREA_PATTERNS) {
    if (pattern.test(content)) {
      affectedArea = area;
      break;
    }
  }

  return {
    type: detectedType,
    affectedArea,
    description: content,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Migration Guide Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Determine severity based on breaking change type
 */
function getSeverityForType(type: BreakingChangeType): Severity {
  switch (type) {
    case 'removed':
      return 'high';
    case 'renamed':
      return 'low';
    case 'changed':
      return 'medium';
    case 'deprecated':
      return 'low';
    default:
      return 'medium';
  }
}

/**
 * Generate migration steps based on breaking change type
 */
function generateStepsForType(
  type: BreakingChangeType,
  info: BreakingChangeInfo
): MigrationStep[] {
  const steps: MigrationStep[] = [];

  switch (type) {
    case 'removed':
      steps.push({
        order: 1,
        title: 'Identify usage',
        description: `Search your codebase for references to the removed ${info.affectedArea.toLowerCase()} functionality.`,
        automated: false,
      });
      steps.push({
        order: 2,
        title: 'Find alternative',
        description: 'Check the changelog or documentation for recommended alternatives.',
        automated: false,
      });
      steps.push({
        order: 3,
        title: 'Update references',
        description: 'Replace all usages with the new approach or alternative.',
        automated: false,
      });
      steps.push({
        order: 4,
        title: 'Test thoroughly',
        description: 'Verify the migration works as expected in your workflow.',
        automated: false,
      });
      break;

    case 'renamed':
      steps.push({
        order: 1,
        title: 'Find old references',
        description: `Search for the old name in your ${info.affectedArea.toLowerCase()} configurations.`,
        automated: true,
      });
      steps.push({
        order: 2,
        title: 'Update to new name',
        description: 'Replace the old name with the new one throughout your project.',
        automated: true,
      });
      steps.push({
        order: 3,
        title: 'Verify functionality',
        description: 'Confirm the renamed feature works correctly.',
        automated: false,
      });
      break;

    case 'changed':
      steps.push({
        order: 1,
        title: 'Review the change',
        description: `Understand how the ${info.affectedArea.toLowerCase()} behavior has changed.`,
        automated: false,
      });
      steps.push({
        order: 2,
        title: 'Assess impact',
        description: 'Determine how this change affects your current workflow.',
        automated: false,
      });
      steps.push({
        order: 3,
        title: 'Update configurations',
        description: 'Modify settings or code to align with the new behavior.',
        automated: false,
      });
      steps.push({
        order: 4,
        title: 'Test edge cases',
        description: 'Verify your workflow handles the new behavior correctly.',
        automated: false,
      });
      break;

    case 'deprecated':
      steps.push({
        order: 1,
        title: 'Note the deprecation',
        description: `The ${info.affectedArea.toLowerCase()} feature is deprecated but still functional.`,
        automated: false,
      });
      steps.push({
        order: 2,
        title: 'Plan migration',
        description: 'Schedule time to migrate before the feature is removed.',
        automated: false,
      });
      steps.push({
        order: 3,
        title: 'Find replacement',
        description: 'Identify and learn the recommended replacement approach.',
        automated: false,
      });
      break;
  }

  return steps;
}

/**
 * Estimate effort based on severity and step count
 */
function estimateEffort(severity: Severity, stepCount: number): string {
  if (severity === 'critical') return '1-2 hours';
  if (severity === 'high') return '30-60 minutes';
  if (severity === 'medium') return '15-30 minutes';
  if (stepCount <= 2) return '5-10 minutes';
  return '10-15 minutes';
}

/**
 * Generate a complete migration guide for a breaking change entry
 */
export function generateMigrationGuide(entry: ParsedEntry): MigrationGuide | null {
  const breakingChange = detectBreakingChange(entry);

  if (!breakingChange) {
    return null;
  }

  const severity = getSeverityForType(breakingChange.type);
  const steps = generateStepsForType(breakingChange.type, breakingChange);

  // Generate a descriptive title
  const typeLabels: Record<BreakingChangeType, string> = {
    removed: 'Feature Removal',
    renamed: 'Renaming',
    changed: 'Behavior Change',
    deprecated: 'Deprecation Notice',
  };

  const title = `${breakingChange.affectedArea} ${typeLabels[breakingChange.type]}`;

  // Create summary from the original content
  const summary = breakingChange.description.length > 200
    ? breakingChange.description.substring(0, 197) + '...'
    : breakingChange.description;

  return {
    title,
    summary,
    severity,
    steps,
    estimatedEffort: estimateEffort(severity, steps.length),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────────────────

const SEVERITY_BADGES: Record<Severity, string> = {
  critical: '\u{1F534}', // Red circle
  high: '\u{1F7E0}',     // Orange circle
  medium: '\u{1F7E1}',   // Yellow circle
  low: '\u{1F7E2}',      // Green circle
};

/**
 * Format severity level with badge
 */
export function formatSeverity(severity: Severity): string {
  const badge = SEVERITY_BADGES[severity];
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return `${badge} ${label}`;
}

/**
 * Format a migration guide as markdown
 */
export function formatMigrationGuide(guide: MigrationGuide): string {
  const lines: string[] = [];

  // Header with severity badge
  lines.push(`## ${guide.title}`);
  lines.push('');
  lines.push(`**Severity:** ${formatSeverity(guide.severity)}`);

  if (guide.estimatedEffort) {
    lines.push(`**Estimated Effort:** ${guide.estimatedEffort}`);
  }

  lines.push('');

  // Summary
  lines.push('### Summary');
  lines.push('');
  lines.push(guide.summary);
  lines.push('');

  // Steps
  lines.push('### Migration Steps');
  lines.push('');

  for (const step of guide.steps) {
    const automatedTag = step.automated ? ' *(can be automated)*' : '';
    lines.push(`${step.order}. **${step.title}**${automatedTag}`);
    lines.push(`   ${step.description}`);
    lines.push('');
  }

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Handler
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create an action handler for migration-related actions
 */
export function createMigrationHandler(
  options: MigrationHandlerOptions
): ActionHandler {
  return {
    canHandle(entry: ParsedEntry, action: UserAction): boolean {
      return entry.category === 'breaking' && action === 'view_migration';
    },

    async execute(entry: ParsedEntry, _action: UserAction): Promise<ActionResult> {
      const guide = generateMigrationGuide(entry);

      if (!guide) {
        return {
          success: false,
          error: 'Could not generate migration guide for this entry',
          recoverable: true,
        };
      }

      const formatted = formatMigrationGuide(guide);

      return {
        success: true,
        message: formatted,
        details: {
          title: guide.title,
          severity: guide.severity,
          stepCount: guide.steps.length,
          estimatedEffort: guide.estimatedEffort,
        },
      };
    },

    describe(): string {
      return 'Migration Guide Handler - Generates step-by-step migration guides for breaking changes';
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter entries to get only breaking changes
 */
export function getBreakingChanges(entries: ParsedEntry[]): ParsedEntry[] {
  return entries.filter(entry => entry.category === 'breaking');
}

/**
 * Generate migration guides for all breaking change entries
 */
export function generateAllMigrationGuides(
  entries: ParsedEntry[]
): Array<{ entry: ParsedEntry; guide: MigrationGuide }> {
  const breakingEntries = getBreakingChanges(entries);
  const results: Array<{ entry: ParsedEntry; guide: MigrationGuide }> = [];

  for (const entry of breakingEntries) {
    const guide = generateMigrationGuide(entry);
    if (guide) {
      results.push({ entry, guide });
    }
  }

  return results;
}

/**
 * Generate a summary report of all breaking changes
 */
export function generateBreakingChangesSummary(entries: ParsedEntry[]): string {
  const breakingEntries = getBreakingChanges(entries);

  if (breakingEntries.length === 0) {
    return 'No breaking changes detected in the current update.';
  }

  const lines: string[] = [];

  lines.push('# Breaking Changes Summary');
  lines.push('');

  // Count by severity
  const guides = generateAllMigrationGuides(entries);
  const bySeverity: Record<Severity, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const { guide } of guides) {
    bySeverity[guide.severity]++;
  }

  // Overview
  lines.push('## Overview');
  lines.push('');
  lines.push(`**Total Breaking Changes:** ${breakingEntries.length}`);
  lines.push('');

  if (bySeverity.critical > 0) {
    lines.push(`- ${formatSeverity('critical')}: ${bySeverity.critical}`);
  }
  if (bySeverity.high > 0) {
    lines.push(`- ${formatSeverity('high')}: ${bySeverity.high}`);
  }
  if (bySeverity.medium > 0) {
    lines.push(`- ${formatSeverity('medium')}: ${bySeverity.medium}`);
  }
  if (bySeverity.low > 0) {
    lines.push(`- ${formatSeverity('low')}: ${bySeverity.low}`);
  }

  lines.push('');

  // Individual guides
  lines.push('## Details');
  lines.push('');

  for (const { guide } of guides) {
    lines.push(`### ${guide.title}`);
    lines.push('');
    lines.push(`${formatSeverity(guide.severity)} | ${guide.estimatedEffort || 'Unknown effort'}`);
    lines.push('');
    lines.push(`> ${guide.summary}`);
    lines.push('');
    lines.push(`Steps: ${guide.steps.length}`);
    lines.push('');
  }

  // Estimated total effort
  const totalMinutes = guides.reduce((sum, { guide }) => {
    const effort = guide.estimatedEffort || '15-30 minutes';
    const match = effort.match(/(\d+)-?(\d+)?/);
    if (match) {
      const avg = match[2]
        ? (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2
        : parseInt(match[1], 10);
      return sum + avg;
    }
    return sum + 15;
  }, 0);

  lines.push('---');
  lines.push('');
  lines.push(`**Estimated Total Migration Time:** ${Math.round(totalMinutes)} minutes`);

  return lines.join('\n');
}

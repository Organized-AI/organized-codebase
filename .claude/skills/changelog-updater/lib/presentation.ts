/**
 * Interactive Presentation Layer (feat-005)
 *
 * Defines UI structure for presenting changelog updates to users
 * and builds options for the AskUserQuestion tool.
 */

import type { ParsedEntry, EntryCategory, ActionType } from './entry-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type UserAction =
  | 'apply'
  | 'skip'
  | 'learn_more'
  | 'try_command'
  | 'view_migration'
  | 'acknowledge'
  | 'acknowledge_all'
  | 'apply_all'
  | 'review_one_by_one'
  | 'dismiss';

export interface ActionButton {
  action: UserAction;
  label: string;
  description?: string;
}

export interface PresentationGroup {
  icon: string;
  title: string;
  category: EntryCategory;
  actionType: ActionType;
  entries: ParsedEntry[];
  actions: ActionButton[];
  requiresAction: boolean;
}

export interface PresentationConfig {
  showEmptyGroups: boolean;
  maxEntriesPerGroup: number;
  compactMode: boolean;
  showConfidence: boolean;
}

export interface AskUserQuestionOption {
  label: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Group Configuration
// ─────────────────────────────────────────────────────────────────────────────

interface GroupConfig {
  icon: string;
  title: string;
  actionButtons: ActionButton[];
  requiresAction: boolean;
}

const GROUP_CONFIGS: Record<EntryCategory, GroupConfig> = {
  architecture: {
    icon: '🏗️',
    title: 'Architecture Changes',
    actionButtons: [
      { action: 'learn_more', label: 'Learn more', description: 'Understand the implications' },
      { action: 'acknowledge', label: 'I understand', description: 'Mark as reviewed' },
    ],
    requiresAction: true,
  },

  command: {
    icon: '⚡',
    title: 'New Commands',
    actionButtons: [
      { action: 'try_command', label: 'Try it', description: 'Execute the command now' },
      { action: 'skip', label: 'Skip', description: 'Review later' },
    ],
    requiresAction: true,
  },

  config: {
    icon: '🔧',
    title: 'Config Updates',
    actionButtons: [
      { action: 'apply', label: 'Apply', description: 'Update your settings' },
      { action: 'skip', label: 'Skip', description: 'Keep current settings' },
    ],
    requiresAction: true,
  },

  tool: {
    icon: '🔌',
    title: 'Tool & Integration Changes',
    actionButtons: [
      { action: 'learn_more', label: 'View details', description: 'See what changed' },
      { action: 'acknowledge', label: 'Acknowledge', description: 'Mark as seen' },
    ],
    requiresAction: false,
  },

  breaking: {
    icon: '⚠️',
    title: 'Breaking Changes',
    actionButtons: [
      { action: 'view_migration', label: 'View migration', description: 'See how to update' },
      { action: 'acknowledge', label: 'Acknowledge', description: 'Mark as reviewed' },
    ],
    requiresAction: true,
  },

  improvement: {
    icon: '📈',
    title: 'Improvements',
    actionButtons: [
      { action: 'acknowledge_all', label: 'Acknowledge all', description: 'No action needed' },
    ],
    requiresAction: false,
  },

  fix: {
    icon: '🐛',
    title: 'Bug Fixes',
    actionButtons: [
      { action: 'acknowledge_all', label: 'Acknowledge all', description: 'No action needed' },
    ],
    requiresAction: false,
  },
};

// Display order for groups
const GROUP_ORDER: EntryCategory[] = [
  'breaking',
  'architecture',
  'command',
  'config',
  'tool',
  'improvement',
  'fix',
];

// ─────────────────────────────────────────────────────────────────────────────
// Grouping Logic
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: PresentationConfig = {
  showEmptyGroups: false,
  maxEntriesPerGroup: 10,
  compactMode: false,
  showConfidence: false,
};

/**
 * Group parsed entries into presentation groups
 */
export function groupEntriesByCategory(
  entries: ParsedEntry[],
  config: Partial<PresentationConfig> = {}
): PresentationGroup[] {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const groups: PresentationGroup[] = [];

  // Group entries by category
  const byCategory = new Map<EntryCategory, ParsedEntry[]>();
  for (const entry of entries) {
    const existing = byCategory.get(entry.category) || [];
    existing.push(entry);
    byCategory.set(entry.category, existing);
  }

  // Create presentation groups in display order
  for (const category of GROUP_ORDER) {
    const categoryEntries = byCategory.get(category) || [];

    if (categoryEntries.length === 0 && !mergedConfig.showEmptyGroups) {
      continue;
    }

    const groupConfig = GROUP_CONFIGS[category];

    groups.push({
      icon: groupConfig.icon,
      title: groupConfig.title,
      category,
      actionType: categoryEntries[0]?.actionType || 'awareness',
      entries: categoryEntries.slice(0, mergedConfig.maxEntriesPerGroup),
      actions: groupConfig.actionButtons,
      requiresAction: groupConfig.requiresAction && categoryEntries.length > 0,
    });
  }

  return groups;
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a single entry for display
 */
function formatEntry(entry: ParsedEntry, indent: string = '  '): string {
  const lines: string[] = [];

  // Main content line
  lines.push(`${indent}• ${entry.original.content}`);

  // Add extracted details if present
  const details = entry.extractedDetails;
  if (details.commands?.length) {
    lines.push(`${indent}  Commands: ${details.commands.join(', ')}`);
  }
  if (details.envVars?.length) {
    lines.push(`${indent}  Env vars: ${details.envVars.join(', ')}`);
  }
  if (details.shortcuts?.length) {
    lines.push(`${indent}  Shortcuts: ${details.shortcuts.join(', ')}`);
  }

  return lines.join('\n');
}

/**
 * Format a presentation group for display
 */
export function formatGroupForDisplay(group: PresentationGroup): string {
  const lines: string[] = [];

  // Header with count
  const count = group.entries.length;
  lines.push(`${group.icon} ${group.title} (${count})`);

  // Entries
  for (const entry of group.entries) {
    lines.push(formatEntry(entry, '   '));
  }

  // Action buttons
  const actionLine = group.actions.map(a => `[${a.label}]`).join(' ');
  lines.push(`   └─ ${actionLine}`);

  return lines.join('\n');
}

/**
 * Format all groups as a complete update summary
 */
export function formatUpdateSummary(
  groups: PresentationGroup[],
  fromVersion: string | null,
  toVersion: string
): string {
  const lines: string[] = [];

  // Header
  const versionRange = fromVersion
    ? `v${fromVersion} → v${toVersion}`
    : `v${toVersion}`;

  lines.push('╭─────────────────────────────────────────────────────────────────╮');
  lines.push(`│  📋 Claude Code Updates Available (${versionRange})`.padEnd(66) + '│');
  lines.push('╰─────────────────────────────────────────────────────────────────╯');
  lines.push('');

  // Groups
  for (const group of groups) {
    if (group.entries.length > 0) {
      lines.push(formatGroupForDisplay(group));
      lines.push('');
    }
  }

  // Footer actions
  lines.push('────────────────────────────────────────────────────────────────────');
  lines.push('[Apply All Recommendations] [Review One-by-One] [Dismiss for Now]');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// AskUserQuestion Integration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build options for a single group question
 */
export function buildGroupQuestionOptions(group: PresentationGroup): AskUserQuestionOption[] {
  return group.actions.map(action => ({
    label: action.label,
    description: action.description || '',
  }));
}

/**
 * Build the main update summary question
 */
export function buildSummaryQuestion(groups: PresentationGroup[]): {
  question: string;
  header: string;
  options: AskUserQuestionOption[];
} {
  const actionableCount = groups.filter(g => g.requiresAction).length;
  const totalEntries = groups.reduce((sum, g) => sum + g.entries.length, 0);

  return {
    question: `${totalEntries} changelog updates available. How would you like to proceed?`,
    header: 'Updates',
    options: [
      {
        label: 'Apply All Recommendations',
        description: 'Automatically apply suggested config changes and mark all as reviewed',
      },
      {
        label: 'Review One-by-One',
        description: `Walk through ${actionableCount} actionable updates interactively`,
      },
      {
        label: 'View Summary Only',
        description: 'See what changed without taking action',
      },
      {
        label: 'Dismiss for Now',
        description: 'Skip until next update check',
      },
    ],
  };
}

/**
 * Build a question for a specific entry
 */
export function buildEntryQuestion(entry: ParsedEntry): {
  question: string;
  header: string;
  options: AskUserQuestionOption[];
} {
  const config = GROUP_CONFIGS[entry.category];

  return {
    question: entry.original.content,
    header: config.title,
    options: config.actionButtons.map(btn => ({
      label: btn.label,
      description: btn.description || '',
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get count of entries requiring action
 */
export function getActionableCount(groups: PresentationGroup[]): number {
  return groups
    .filter(g => g.requiresAction)
    .reduce((sum, g) => sum + g.entries.length, 0);
}

/**
 * Get summary counts by category
 */
export function getCategoryCounts(groups: PresentationGroup[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const group of groups) {
    counts[group.category] = group.entries.length;
  }
  return counts;
}

/**
 * Check if there are any breaking changes
 */
export function hasBreakingChanges(groups: PresentationGroup[]): boolean {
  const breakingGroup = groups.find(g => g.category === 'breaking');
  return breakingGroup !== undefined && breakingGroup.entries.length > 0;
}

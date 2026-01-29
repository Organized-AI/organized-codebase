/**
 * Summary Report Generation (feat-012)
 *
 * Generates comprehensive summary reports after batch changelog updates.
 * Supports markdown, plain text, and JSON output formats.
 */

import type { ParsedEntry, EntryCategory } from './entry-parser';
import type { BatchResult, BatchAction } from './batch-apply';
import { getBreakingChanges } from './migration-handler';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ReportSection {
  title: string;
  items: string[];
  icon?: string;
}

export interface UpdateSummary {
  version: string;
  date: string;
  applied: ReportSection;
  skipped: ReportSection;
  errors: ReportSection;
  breaking: ReportSection;
}

export interface ReportOptions {
  includeTimestamp: boolean;
  includeStats: boolean;
  format: 'markdown' | 'text' | 'json';
}

export interface ReportStats {
  total: number;
  applied: number;
  skipped: number;
  errors: number;
  breakingCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Options
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_REPORT_OPTIONS: ReportOptions = {
  includeTimestamp: true,
  includeStats: true,
  format: 'markdown',
};

// ─────────────────────────────────────────────────────────────────────────────
// Section Icons
// ─────────────────────────────────────────────────────────────────────────────

const SECTION_ICONS: Record<string, string> = {
  applied: '[+]',
  skipped: '[-]',
  errors: '[!]',
  breaking: '[*]',
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a report section from parsed entries
 */
export function createReportSection(
  title: string,
  entries: ParsedEntry[],
  icon?: string
): ReportSection {
  return {
    title,
    items: entries.map(entry => {
      const content = entry.original.content;
      // Truncate long entries for readability
      return content.length > 100 ? content.substring(0, 97) + '...' : content;
    }),
    icon,
  };
}

/**
 * Create a report section from batch actions
 */
function createSectionFromBatchActions(
  title: string,
  actions: BatchAction[],
  icon?: string
): ReportSection {
  return {
    title,
    items: actions.map(action => {
      const content = action.entry.original.content;
      const truncated = content.length > 80 ? content.substring(0, 77) + '...' : content;
      return `[${action.action}] ${truncated}`;
    }),
    icon,
  };
}

/**
 * Create an error section from failed batch actions
 */
function createErrorSection(
  failed: Array<{ action: BatchAction; error: string }>
): ReportSection {
  return {
    title: 'Errors',
    items: failed.map(({ action, error }) => {
      const content = action.entry.original.content;
      const truncated = content.length > 50 ? content.substring(0, 47) + '...' : content;
      return `${truncated} -- Error: ${error}`;
    }),
    icon: SECTION_ICONS.errors,
  };
}

/**
 * Get the current date in ISO format
 */
function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get full ISO timestamp
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// Summary Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate an update summary from a batch result
 */
export function generateSummary(
  batchResult: BatchResult,
  version: string,
  options: Partial<ReportOptions> = {}
): UpdateSummary {
  const mergedOptions = { ...DEFAULT_REPORT_OPTIONS, ...options };

  // Extract breaking changes from successful actions
  const allEntries = [
    ...batchResult.successful.map(a => a.entry),
    ...batchResult.skipped.map(a => a.entry),
    ...batchResult.failed.map(f => f.action.entry),
  ];
  const breakingEntries = getBreakingChanges(allEntries);

  const date = mergedOptions.includeTimestamp ? getTimestamp() : getCurrentDate();

  return {
    version,
    date,
    applied: createSectionFromBatchActions(
      'Applied Changes',
      batchResult.successful,
      SECTION_ICONS.applied
    ),
    skipped: createSectionFromBatchActions(
      'Skipped',
      batchResult.skipped,
      SECTION_ICONS.skipped
    ),
    errors: createErrorSection(batchResult.failed),
    breaking: createReportSection(
      'Breaking Changes',
      breakingEntries,
      SECTION_ICONS.breaking
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Statistics
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get statistics from an update summary
 */
export function getReportStats(summary: UpdateSummary): ReportStats {
  return {
    total:
      summary.applied.items.length +
      summary.skipped.items.length +
      summary.errors.items.length,
    applied: summary.applied.items.length,
    skipped: summary.skipped.items.length,
    errors: summary.errors.items.length,
    breakingCount: summary.breaking.items.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an update summary as markdown
 */
export function formatAsMarkdown(summary: UpdateSummary): string {
  const lines: string[] = [];
  const stats = getReportStats(summary);

  // Header
  lines.push(`# Changelog Update Summary`);
  lines.push('');
  lines.push(`**Version:** ${summary.version}`);
  lines.push(`**Date:** ${summary.date}`);
  lines.push('');

  // Stats badge row
  lines.push('## Statistics');
  lines.push('');
  lines.push(`| Applied | Skipped | Errors | Breaking |`);
  lines.push(`|---------|---------|--------|----------|`);
  lines.push(`| ${stats.applied} | ${stats.skipped} | ${stats.errors} | ${stats.breakingCount} |`);
  lines.push('');

  // Applied section
  if (summary.applied.items.length > 0) {
    lines.push(`## ${summary.applied.icon || ''} ${summary.applied.title}`);
    lines.push('');
    for (const item of summary.applied.items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Breaking changes section (highlighted)
  if (summary.breaking.items.length > 0) {
    lines.push(`## ${summary.breaking.icon || ''} ${summary.breaking.title}`);
    lines.push('');
    lines.push('> **Important:** Review these breaking changes carefully.');
    lines.push('');
    for (const item of summary.breaking.items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Skipped section
  if (summary.skipped.items.length > 0) {
    lines.push(`## ${summary.skipped.icon || ''} ${summary.skipped.title}`);
    lines.push('');
    for (const item of summary.skipped.items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Errors section
  if (summary.errors.items.length > 0) {
    lines.push(`## ${summary.errors.icon || ''} ${summary.errors.title}`);
    lines.push('');
    lines.push('> **Warning:** The following actions encountered errors.');
    lines.push('');
    for (const item of summary.errors.items) {
      lines.push(`- ${item}`);
    }
    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push(`*Report generated by changelog-updater*`);

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// Plain Text Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an update summary as plain text (for terminal output)
 */
export function formatAsText(summary: UpdateSummary): string {
  const lines: string[] = [];
  const stats = getReportStats(summary);

  // Header
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('               CHANGELOG UPDATE SUMMARY');
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('');
  lines.push(`  Version: ${summary.version}`);
  lines.push(`  Date:    ${summary.date}`);
  lines.push('');

  // Stats
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push('  STATISTICS');
  lines.push('───────────────────────────────────────────────────────────────');
  lines.push(`  Applied:  ${stats.applied}`);
  lines.push(`  Skipped:  ${stats.skipped}`);
  lines.push(`  Errors:   ${stats.errors}`);
  lines.push(`  Breaking: ${stats.breakingCount}`);
  lines.push('');

  // Applied section
  if (summary.applied.items.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  ${summary.applied.icon || '[+]'} ${summary.applied.title.toUpperCase()}`);
    lines.push('───────────────────────────────────────────────────────────────');
    for (const item of summary.applied.items) {
      lines.push(`    * ${item}`);
    }
    lines.push('');
  }

  // Breaking changes section
  if (summary.breaking.items.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  ${summary.breaking.icon || '[*]'} ${summary.breaking.title.toUpperCase()}`);
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('  !! Review these breaking changes carefully !!');
    lines.push('');
    for (const item of summary.breaking.items) {
      lines.push(`    * ${item}`);
    }
    lines.push('');
  }

  // Skipped section
  if (summary.skipped.items.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  ${summary.skipped.icon || '[-]'} ${summary.skipped.title.toUpperCase()}`);
    lines.push('───────────────────────────────────────────────────────────────');
    for (const item of summary.skipped.items) {
      lines.push(`    - ${item}`);
    }
    lines.push('');
  }

  // Errors section
  if (summary.errors.items.length > 0) {
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push(`  ${summary.errors.icon || '[!]'} ${summary.errors.title.toUpperCase()}`);
    lines.push('───────────────────────────────────────────────────────────────');
    lines.push('  !! The following actions encountered errors !!');
    lines.push('');
    for (const item of summary.errors.items) {
      lines.push(`    ! ${item}`);
    }
    lines.push('');
  }

  // Footer
  lines.push('═══════════════════════════════════════════════════════════════');
  lines.push('  Report generated by changelog-updater');
  lines.push('═══════════════════════════════════════════════════════════════');

  return lines.join('\n');
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON Format
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format an update summary as JSON
 */
export function formatAsJson(summary: UpdateSummary): string {
  const stats = getReportStats(summary);

  const jsonOutput = {
    meta: {
      version: summary.version,
      date: summary.date,
      generator: 'changelog-updater',
    },
    stats,
    sections: {
      applied: {
        title: summary.applied.title,
        count: summary.applied.items.length,
        items: summary.applied.items,
      },
      skipped: {
        title: summary.skipped.title,
        count: summary.skipped.items.length,
        items: summary.skipped.items,
      },
      errors: {
        title: summary.errors.title,
        count: summary.errors.items.length,
        items: summary.errors.items,
      },
      breaking: {
        title: summary.breaking.title,
        count: summary.breaking.items.length,
        items: summary.breaking.items,
      },
    },
  };

  return JSON.stringify(jsonOutput, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Format Dispatcher
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a summary using the specified format
 */
export function formatReport(
  summary: UpdateSummary,
  options: Partial<ReportOptions> = {}
): string {
  const mergedOptions = { ...DEFAULT_REPORT_OPTIONS, ...options };

  switch (mergedOptions.format) {
    case 'markdown':
      return formatAsMarkdown(summary);
    case 'text':
      return formatAsText(summary);
    case 'json':
      return formatAsJson(summary);
    default:
      return formatAsMarkdown(summary);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// File Operations
// ─────────────────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Save a summary report to a file
 */
export async function saveReport(
  summary: UpdateSummary,
  filePath: string,
  format: 'md' | 'txt' | 'json'
): Promise<{ success: boolean; path: string; error?: string }> {
  try {
    // Map file extension to report format
    const formatMap: Record<string, ReportOptions['format']> = {
      md: 'markdown',
      txt: 'text',
      json: 'json',
    };

    const content = formatReport(summary, { format: formatMap[format] });

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content, 'utf-8');

    return { success: true, path: filePath };
  } catch (error) {
    return {
      success: false,
      path: filePath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Generate a default filename for a report
 */
export function generateReportFilename(
  version: string,
  format: 'md' | 'txt' | 'json'
): string {
  const date = new Date().toISOString().split('T')[0];
  const safeVersion = version.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `changelog-update-${safeVersion}-${date}.${format}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick Summary for Terminal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a one-line summary string
 */
export function getQuickSummary(summary: UpdateSummary): string {
  const stats = getReportStats(summary);
  const parts: string[] = [];

  parts.push(`v${summary.version}`);
  parts.push(`${stats.applied} applied`);

  if (stats.skipped > 0) {
    parts.push(`${stats.skipped} skipped`);
  }

  if (stats.errors > 0) {
    parts.push(`${stats.errors} errors`);
  }

  if (stats.breakingCount > 0) {
    parts.push(`${stats.breakingCount} breaking`);
  }

  return parts.join(' | ');
}

/**
 * Check if the summary has any errors
 */
export function hasErrors(summary: UpdateSummary): boolean {
  return summary.errors.items.length > 0;
}

/**
 * Check if the summary has any breaking changes
 */
export function hasBreakingChanges(summary: UpdateSummary): boolean {
  return summary.breaking.items.length > 0;
}

/**
 * Check if the update was fully successful (no errors)
 */
export function isFullySuccessful(summary: UpdateSummary): boolean {
  return summary.errors.items.length === 0;
}

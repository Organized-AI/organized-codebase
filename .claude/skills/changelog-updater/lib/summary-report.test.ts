/**
 * Summary Report Generation Tests (feat-012)
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';

import type { ParsedEntry, EntryCategory, ActionType } from './entry-parser';
import type { BatchResult, BatchAction } from './batch-apply';
import type { UserAction } from './presentation';

import {
  generateSummary,
  formatAsMarkdown,
  formatAsText,
  formatAsJson,
  formatReport,
  getReportStats,
  createReportSection,
  getQuickSummary,
  hasErrors,
  hasBreakingChanges,
  isFullySuccessful,
  generateReportFilename,
  type UpdateSummary,
  type ReportSection,
  type ReportOptions,
  type ReportStats,
} from './summary-report';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

function createMockParsedEntry(overrides: {
  content?: string;
  category?: EntryCategory;
  section?: string;
  actionType?: ActionType;
}): ParsedEntry {
  return {
    original: {
      content: overrides.content || 'Test entry content',
      section: overrides.section || 'added',
      version: '1.0.0',
    },
    category: overrides.category || 'improvement',
    actionRequired: false,
    actionType: overrides.actionType || 'awareness',
    extractedDetails: {},
    confidence: 0.8,
  };
}

function createMockBatchAction(
  entry: ParsedEntry,
  action: UserAction = 'acknowledge'
): BatchAction {
  return {
    entry,
    action,
    handler: null,
  };
}

function createMockBatchResult(options: {
  successCount?: number;
  failedCount?: number;
  skippedCount?: number;
  includeBreaking?: boolean;
}): BatchResult {
  const successful: BatchAction[] = [];
  const failed: Array<{ action: BatchAction; error: string }> = [];
  const skipped: BatchAction[] = [];

  // Create successful entries
  for (let i = 0; i < (options.successCount || 0); i++) {
    const entry = createMockParsedEntry({
      content: `Successful change ${i + 1}`,
      category: 'improvement',
    });
    successful.push(createMockBatchAction(entry, 'apply'));
  }

  // Create failed entries
  for (let i = 0; i < (options.failedCount || 0); i++) {
    const entry = createMockParsedEntry({
      content: `Failed change ${i + 1}`,
      category: 'config',
    });
    failed.push({
      action: createMockBatchAction(entry, 'apply'),
      error: `Error ${i + 1}: Something went wrong`,
    });
  }

  // Create skipped entries
  for (let i = 0; i < (options.skippedCount || 0); i++) {
    const entry = createMockParsedEntry({
      content: `Skipped change ${i + 1}`,
      category: 'fix',
    });
    skipped.push(createMockBatchAction(entry, 'skip'));
  }

  // Add breaking change if requested
  if (options.includeBreaking) {
    const breakingEntry = createMockParsedEntry({
      content: 'Removed deprecated API endpoint',
      category: 'breaking',
      section: 'Removed',
    });
    successful.push(createMockBatchAction(breakingEntry, 'view_migration'));
  }

  return { successful, failed, skipped };
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests: createReportSection
// ─────────────────────────────────────────────────────────────────────────────

describe('createReportSection', () => {
  it('should create a section with title and items', () => {
    const entries: ParsedEntry[] = [
      createMockParsedEntry({ content: 'Entry 1' }),
      createMockParsedEntry({ content: 'Entry 2' }),
    ];

    const section = createReportSection('Test Section', entries, '[+]');

    assert.strictEqual(section.title, 'Test Section');
    assert.strictEqual(section.items.length, 2);
    assert.strictEqual(section.icon, '[+]');
    assert.strictEqual(section.items[0], 'Entry 1');
    assert.strictEqual(section.items[1], 'Entry 2');
  });

  it('should truncate long content to 100 characters', () => {
    const longContent = 'A'.repeat(150);
    const entries = [createMockParsedEntry({ content: longContent })];

    const section = createReportSection('Long Content', entries);

    assert.strictEqual(section.items[0].length, 100);
    assert.ok(section.items[0].endsWith('...'));
  });

  it('should handle empty entries array', () => {
    const section = createReportSection('Empty Section', []);

    assert.strictEqual(section.title, 'Empty Section');
    assert.strictEqual(section.items.length, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: generateSummary
// ─────────────────────────────────────────────────────────────────────────────

describe('generateSummary', () => {
  it('should generate a summary from batch result', () => {
    const batchResult = createMockBatchResult({
      successCount: 3,
      failedCount: 1,
      skippedCount: 2,
    });

    const summary = generateSummary(batchResult, '1.0.5');

    assert.strictEqual(summary.version, '1.0.5');
    assert.ok(summary.date);
    assert.strictEqual(summary.applied.items.length, 3);
    assert.strictEqual(summary.errors.items.length, 1);
    assert.strictEqual(summary.skipped.items.length, 2);
  });

  it('should include breaking changes section', () => {
    const batchResult = createMockBatchResult({
      successCount: 2,
      includeBreaking: true,
    });

    const summary = generateSummary(batchResult, '2.0.0');

    assert.strictEqual(summary.breaking.items.length, 1);
    assert.ok(summary.breaking.items[0].includes('Removed'));
  });

  it('should use timestamp when includeTimestamp is true', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });

    const summary = generateSummary(batchResult, '1.0.0', { includeTimestamp: true });

    // ISO timestamp includes 'T' separator
    assert.ok(summary.date.includes('T'));
  });

  it('should use date only when includeTimestamp is false', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });

    const summary = generateSummary(batchResult, '1.0.0', { includeTimestamp: false });

    // Date only format: YYYY-MM-DD (no T)
    assert.ok(!summary.date.includes('T'));
    assert.match(summary.date, /^\d{4}-\d{2}-\d{2}$/);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: getReportStats
// ─────────────────────────────────────────────────────────────────────────────

describe('getReportStats', () => {
  it('should calculate correct statistics', () => {
    const batchResult = createMockBatchResult({
      successCount: 5,
      failedCount: 2,
      skippedCount: 3,
      includeBreaking: true,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    const stats = getReportStats(summary);

    assert.strictEqual(stats.applied, 6); // 5 + 1 breaking
    assert.strictEqual(stats.skipped, 3);
    assert.strictEqual(stats.errors, 2);
    assert.strictEqual(stats.total, 11);
    assert.strictEqual(stats.breakingCount, 1);
  });

  it('should return zeros for empty result', () => {
    const batchResult = createMockBatchResult({});
    const summary = generateSummary(batchResult, '1.0.0');

    const stats = getReportStats(summary);

    assert.strictEqual(stats.total, 0);
    assert.strictEqual(stats.applied, 0);
    assert.strictEqual(stats.skipped, 0);
    assert.strictEqual(stats.errors, 0);
    assert.strictEqual(stats.breakingCount, 0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatAsMarkdown
// ─────────────────────────────────────────────────────────────────────────────

describe('formatAsMarkdown', () => {
  it('should format summary as markdown with headers', () => {
    const batchResult = createMockBatchResult({
      successCount: 2,
      skippedCount: 1,
    });
    const summary = generateSummary(batchResult, '1.2.3');

    const markdown = formatAsMarkdown(summary);

    assert.ok(markdown.includes('# Changelog Update Summary'));
    assert.ok(markdown.includes('**Version:** 1.2.3'));
    assert.ok(markdown.includes('## Statistics'));
    assert.ok(markdown.includes('| Applied | Skipped | Errors | Breaking |'));
  });

  it('should include applied section when entries exist', () => {
    const batchResult = createMockBatchResult({ successCount: 2 });
    const summary = generateSummary(batchResult, '1.0.0');

    const markdown = formatAsMarkdown(summary);

    assert.ok(markdown.includes('Applied Changes'));
    assert.ok(markdown.includes('Successful change 1'));
    assert.ok(markdown.includes('Successful change 2'));
  });

  it('should highlight breaking changes section', () => {
    const batchResult = createMockBatchResult({ includeBreaking: true });
    const summary = generateSummary(batchResult, '2.0.0');

    const markdown = formatAsMarkdown(summary);

    assert.ok(markdown.includes('Breaking Changes'));
    assert.ok(markdown.includes('Review these breaking changes carefully'));
  });

  it('should include errors section with warning', () => {
    const batchResult = createMockBatchResult({ failedCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const markdown = formatAsMarkdown(summary);

    assert.ok(markdown.includes('Errors'));
    assert.ok(markdown.includes('Warning'));
    assert.ok(markdown.includes('encountered errors'));
  });

  it('should include footer', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const markdown = formatAsMarkdown(summary);

    assert.ok(markdown.includes('Report generated by changelog-updater'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatAsText
// ─────────────────────────────────────────────────────────────────────────────

describe('formatAsText', () => {
  it('should format summary as plain text with box drawing', () => {
    const batchResult = createMockBatchResult({ successCount: 2 });
    const summary = generateSummary(batchResult, '1.0.0');

    const text = formatAsText(summary);

    assert.ok(text.includes('CHANGELOG UPDATE SUMMARY'));
    assert.ok(text.includes('Version: 1.0.0'));
    assert.ok(text.includes('STATISTICS'));
  });

  it('should include all sections with proper formatting', () => {
    const batchResult = createMockBatchResult({
      successCount: 1,
      failedCount: 1,
      skippedCount: 1,
      includeBreaking: true,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    const text = formatAsText(summary);

    assert.ok(text.includes('APPLIED CHANGES'));
    assert.ok(text.includes('SKIPPED'));
    assert.ok(text.includes('ERRORS'));
    assert.ok(text.includes('BREAKING CHANGES'));
  });

  it('should use visual separators', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const text = formatAsText(summary);

    // Check for box drawing characters
    assert.ok(text.includes('═'));
    assert.ok(text.includes('─'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatAsJson
// ─────────────────────────────────────────────────────────────────────────────

describe('formatAsJson', () => {
  it('should produce valid JSON', () => {
    const batchResult = createMockBatchResult({ successCount: 2 });
    const summary = generateSummary(batchResult, '1.0.0');

    const jsonString = formatAsJson(summary);
    const parsed = JSON.parse(jsonString);

    assert.ok(parsed);
    assert.strictEqual(typeof parsed, 'object');
  });

  it('should include meta information', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.5.0');

    const jsonString = formatAsJson(summary);
    const parsed = JSON.parse(jsonString);

    assert.strictEqual(parsed.meta.version, '1.5.0');
    assert.ok(parsed.meta.date);
    assert.strictEqual(parsed.meta.generator, 'changelog-updater');
  });

  it('should include stats', () => {
    const batchResult = createMockBatchResult({
      successCount: 3,
      failedCount: 1,
      skippedCount: 2,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    const jsonString = formatAsJson(summary);
    const parsed = JSON.parse(jsonString);

    assert.strictEqual(parsed.stats.applied, 3);
    assert.strictEqual(parsed.stats.errors, 1);
    assert.strictEqual(parsed.stats.skipped, 2);
    assert.strictEqual(parsed.stats.total, 6);
  });

  it('should include all sections with counts', () => {
    const batchResult = createMockBatchResult({
      successCount: 2,
      failedCount: 1,
      skippedCount: 1,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    const jsonString = formatAsJson(summary);
    const parsed = JSON.parse(jsonString);

    assert.ok(parsed.sections.applied);
    assert.ok(parsed.sections.skipped);
    assert.ok(parsed.sections.errors);
    assert.ok(parsed.sections.breaking);
    assert.strictEqual(parsed.sections.applied.count, 2);
    assert.strictEqual(parsed.sections.errors.count, 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: formatReport
// ─────────────────────────────────────────────────────────────────────────────

describe('formatReport', () => {
  it('should dispatch to markdown formatter by default', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const result = formatReport(summary);

    assert.ok(result.includes('# Changelog Update Summary'));
  });

  it('should dispatch to text formatter', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const result = formatReport(summary, { format: 'text' });

    assert.ok(result.includes('CHANGELOG UPDATE SUMMARY'));
  });

  it('should dispatch to JSON formatter', () => {
    const batchResult = createMockBatchResult({ successCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    const result = formatReport(summary, { format: 'json' });

    const parsed = JSON.parse(result);
    assert.ok(parsed.meta);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

describe('getQuickSummary', () => {
  it('should generate a one-line summary', () => {
    const batchResult = createMockBatchResult({
      successCount: 5,
      skippedCount: 2,
      failedCount: 1,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    const quick = getQuickSummary(summary);

    assert.ok(quick.includes('v1.0.0'));
    assert.ok(quick.includes('5 applied'));
    assert.ok(quick.includes('2 skipped'));
    assert.ok(quick.includes('1 errors'));
  });

  it('should include breaking count when present', () => {
    const batchResult = createMockBatchResult({
      successCount: 1,
      includeBreaking: true,
    });
    const summary = generateSummary(batchResult, '2.0.0');

    const quick = getQuickSummary(summary);

    assert.ok(quick.includes('1 breaking'));
  });

  it('should omit zero counts', () => {
    const batchResult = createMockBatchResult({ successCount: 3 });
    const summary = generateSummary(batchResult, '1.0.0');

    const quick = getQuickSummary(summary);

    assert.ok(!quick.includes('skipped'));
    assert.ok(!quick.includes('errors'));
  });
});

describe('hasErrors', () => {
  it('should return true when errors exist', () => {
    const batchResult = createMockBatchResult({ failedCount: 1 });
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(hasErrors(summary), true);
  });

  it('should return false when no errors', () => {
    const batchResult = createMockBatchResult({ successCount: 2 });
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(hasErrors(summary), false);
  });
});

describe('hasBreakingChanges', () => {
  it('should return true when breaking changes exist', () => {
    const batchResult = createMockBatchResult({ includeBreaking: true });
    const summary = generateSummary(batchResult, '2.0.0');

    assert.strictEqual(hasBreakingChanges(summary), true);
  });

  it('should return false when no breaking changes', () => {
    const batchResult = createMockBatchResult({ successCount: 2 });
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(hasBreakingChanges(summary), false);
  });
});

describe('isFullySuccessful', () => {
  it('should return true when no errors', () => {
    const batchResult = createMockBatchResult({
      successCount: 3,
      skippedCount: 2,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(isFullySuccessful(summary), true);
  });

  it('should return false when errors exist', () => {
    const batchResult = createMockBatchResult({
      successCount: 2,
      failedCount: 1,
    });
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(isFullySuccessful(summary), false);
  });
});

describe('generateReportFilename', () => {
  it('should generate filename with version and date', () => {
    const filename = generateReportFilename('1.0.0', 'md');

    assert.ok(filename.startsWith('changelog-update-1.0.0-'));
    assert.ok(filename.endsWith('.md'));
  });

  it('should sanitize version for filename', () => {
    const filename = generateReportFilename('1.0.0-beta.1', 'json');

    assert.ok(filename.includes('1.0.0-beta.1'));
    assert.ok(filename.endsWith('.json'));
  });

  it('should support different formats', () => {
    const mdFile = generateReportFilename('1.0.0', 'md');
    const txtFile = generateReportFilename('1.0.0', 'txt');
    const jsonFile = generateReportFilename('1.0.0', 'json');

    assert.ok(mdFile.endsWith('.md'));
    assert.ok(txtFile.endsWith('.txt'));
    assert.ok(jsonFile.endsWith('.json'));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Tests: Edge Cases
// ─────────────────────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  it('should handle empty batch result', () => {
    const batchResult: BatchResult = {
      successful: [],
      failed: [],
      skipped: [],
    };
    const summary = generateSummary(batchResult, '1.0.0');

    assert.strictEqual(summary.applied.items.length, 0);
    assert.strictEqual(summary.errors.items.length, 0);
    assert.strictEqual(summary.skipped.items.length, 0);
  });

  it('should handle very long error messages', () => {
    const longError = 'Error: ' + 'A'.repeat(500);
    const entry = createMockParsedEntry({ content: 'Test entry' });
    const batchResult: BatchResult = {
      successful: [],
      failed: [{ action: createMockBatchAction(entry), error: longError }],
      skipped: [],
    };

    const summary = generateSummary(batchResult, '1.0.0');
    const markdown = formatAsMarkdown(summary);

    // Should include error section without crashing
    assert.ok(markdown.includes('Errors'));
  });

  it('should handle special characters in content', () => {
    const entry = createMockParsedEntry({
      content: 'Content with <html> tags & special "quotes"',
    });
    const batchResult: BatchResult = {
      successful: [createMockBatchAction(entry)],
      failed: [],
      skipped: [],
    };

    const summary = generateSummary(batchResult, '1.0.0');
    const json = formatAsJson(summary);

    // JSON should be valid despite special characters
    const parsed = JSON.parse(json);
    assert.ok(parsed);
  });
});

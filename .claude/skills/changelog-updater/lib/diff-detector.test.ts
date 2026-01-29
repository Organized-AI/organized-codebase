/**
 * Tests for Changelog Diff Detector
 *
 * Run with: npx tsx diff-detector.test.ts
 */

import {
  parseFrontmatter,
  extractMetadata,
  parseVersion,
  compareVersions,
  parseChangelogSections,
  detectDiff,
  UpdaterState
} from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_CHANGELOG = `---
title: Claude Code Changelog
source: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
fetched_at: 2025-01-28T14:05:00.000Z
latest_version: 2.1.22
total_versions: 45+
---

# Claude Code Changelog

## 2.1.22 (Latest)

- Fixed structured outputs for non-interactive mode

---

## 2.1.21

### Added
- Support for full-width number input from Japanese IME
- [VSCode] Automatic Python virtual environment activation

### Fixed
- Shell completion cache files being truncated on exit
- Auto-compact triggering too early on models with large output token limits

---

## 2.1.20

### Added
- Arrow key history navigation in vim normal mode
- \`CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD\` env var support

### Fixed
- Session compaction issues
`;

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error}`);
    process.exitCode = 1;
  }
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

// ─────────────────────────────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n📋 Diff Detector Tests\n');

test('parseFrontmatter extracts key-value pairs', () => {
  const result = parseFrontmatter(SAMPLE_CHANGELOG);
  assertEqual(result['latest_version'], '2.1.22');
  assertEqual(result['source'], 'https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md');
});

test('extractMetadata returns ChangelogMetadata', () => {
  const meta = extractMetadata(SAMPLE_CHANGELOG);
  assertEqual(meta.latestVersion, '2.1.22');
  assertEqual(meta.totalVersions, '45+');
});

test('parseVersion handles various formats', () => {
  assertEqual(parseVersion('2.1.22'), [2, 1, 22]);
  assertEqual(parseVersion('v2.1.22'), [2, 1, 22]);
  assertEqual(parseVersion('2.1.22 (Latest)'), [2, 1, 22]);
});

test('compareVersions orders correctly', () => {
  assertEqual(compareVersions('2.1.22', '2.1.21'), 1, '2.1.22 > 2.1.21');
  assertEqual(compareVersions('2.1.21', '2.1.22'), -1, '2.1.21 < 2.1.22');
  assertEqual(compareVersions('2.1.22', '2.1.22'), 0, '2.1.22 = 2.1.22');
  assertEqual(compareVersions('2.2.0', '2.1.99'), 1, '2.2.0 > 2.1.99');
  assertEqual(compareVersions('3.0.0', '2.99.99'), 1, '3.0.0 > 2.99.99');
});

test('parseChangelogSections extracts all versions', () => {
  const sections = parseChangelogSections(SAMPLE_CHANGELOG);
  const versions = [...sections.keys()];

  assertEqual(versions.includes('2.1.22'), true);
  assertEqual(versions.includes('2.1.21'), true);
  assertEqual(versions.includes('2.1.20'), true);
});

test('parseChangelogSections extracts entries with sections', () => {
  const sections = parseChangelogSections(SAMPLE_CHANGELOG);
  const entries221 = sections.get('2.1.21')!;

  // Should have entries from Added and Fixed sections
  const addedEntries = entries221.filter(e => e.section === 'Added');
  const fixedEntries = entries221.filter(e => e.section === 'Fixed');

  assertEqual(addedEntries.length >= 2, true, 'Should have Added entries');
  assertEqual(fixedEntries.length >= 2, true, 'Should have Fixed entries');
});

test('detectDiff with no prior state returns all entries', () => {
  const state: UpdaterState = {
    lastAcknowledgedVersion: null,
    acknowledgedEntries: [],
    appliedConfigs: [],
    skippedEntries: [],
    lastChecked: ''
  };

  const result = detectDiff(SAMPLE_CHANGELOG, state);

  assertEqual(result.hasUpdates, true);
  assertEqual(result.fromVersion, null);
  assertEqual(result.toVersion, '2.1.22');
  assertEqual(result.newVersions.length, 3);
});

test('detectDiff with acknowledged version returns only new entries', () => {
  const state: UpdaterState = {
    lastAcknowledgedVersion: '2.1.20',
    acknowledgedEntries: [],
    appliedConfigs: [],
    skippedEntries: [],
    lastChecked: ''
  };

  const result = detectDiff(SAMPLE_CHANGELOG, state);

  assertEqual(result.hasUpdates, true);
  assertEqual(result.fromVersion, '2.1.20');
  assertEqual(result.toVersion, '2.1.22');
  assertEqual(result.newVersions.includes('2.1.22'), true);
  assertEqual(result.newVersions.includes('2.1.21'), true);
  assertEqual(result.newVersions.includes('2.1.20'), false, '2.1.20 should not be new');
});

test('detectDiff with current version returns no updates', () => {
  const state: UpdaterState = {
    lastAcknowledgedVersion: '2.1.22',
    acknowledgedEntries: [],
    appliedConfigs: [],
    skippedEntries: [],
    lastChecked: ''
  };

  const result = detectDiff(SAMPLE_CHANGELOG, state);

  assertEqual(result.hasUpdates, false);
  assertEqual(result.newVersions.length, 0);
});

console.log('\n✅ All tests passed!\n');

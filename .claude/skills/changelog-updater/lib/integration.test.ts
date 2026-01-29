/**
 * Integration Module Tests (feat-010)
 *
 * Tests for changelog-tracker integration functionality.
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { test, describe, beforeEach, afterEach } from 'node:test';

import {
  createIntegration,
  checkForUpdates,
  processUpdates,
  runUpdateCycle,
  initializeUpdater,
  getChangelogPath,
  getAckStorePath,
  resolveProjectRoot,
  hasUpdatesAvailable,
  getUpdateSummary,
  acknowledgeAll,
  type IntegrationConfig,
  type IntegrationHooks,
  type UpdateCheckResult,
} from './integration';

import { loadAckStore, saveAckStore, type AckStore } from './ack-tracker';
import type { ParsedEntry } from './entry-parser';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_CHANGELOG = `---
latest_version: 2.1.22
fetched_at: 2025-01-28T10:00:00Z
total_versions: 15
source: GitHub Releases
---

# Claude Code Changelog

## 2.1.22 (2025-01-28)

### Added
- New \`/compact\` command for toggling compact response mode
- Support for \`CLAUDE_CODE_MAX_TOKENS\` env var to control token limits

### Fixed
- Fixed memory leak in long-running sessions
- Resolved issue with MCP tool timeouts

### Improved
- Better error messages for authentication failures

## 2.1.21 (2025-01-25)

### Added
- Added support for image attachments in conversations

### Changed
- Replaced old Task system with new streamlined architecture
`;

const SAMPLE_CHANGELOG_SMALL = `---
latest_version: 1.0.1
fetched_at: 2025-01-28T10:00:00Z
total_versions: 2
source: GitHub Releases
---

# Changelog

## 1.0.1 (2025-01-28)

### Added
- Added basic feature

## 1.0.0 (2025-01-01)

### Added
- Initial release
`;

// ─────────────────────────────────────────────────────────────────────────────
// Test Helpers
// ─────────────────────────────────────────────────────────────────────────────

let testDir: string;
let testCount = 0;

function createTestDir(): string {
  testCount++;
  const dir = path.join('/tmp', `integration-test-${Date.now()}-${testCount}`);
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, '.claude'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'DOCUMENTATION'), { recursive: true });
  return dir;
}

function cleanupTestDir(dir: string): void {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function writeChangelog(dir: string, content: string): string {
  const changelogPath = path.join(dir, 'DOCUMENTATION', 'claude-code-changelog.md');
  fs.writeFileSync(changelogPath, content);
  return changelogPath;
}

function createEmptyAckStore(dir: string): string {
  const storePath = path.join(dir, '.claude', 'changelog-ack-store.json');
  const emptyStore: AckStore = {
    version: '1.0.0',
    lastChecked: 0,
    records: {},
  };
  saveAckStore(storePath, emptyStore);
  return storePath;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

describe('Integration Module', () => {
  beforeEach(() => {
    testDir = createTestDir();
  });

  afterEach(() => {
    cleanupTestDir(testDir);
  });

  // -------------------------------------------------------------------------
  // Test 1: Path Resolution
  // -------------------------------------------------------------------------
  test('getChangelogPath finds changelog in DOCUMENTATION directory', () => {
    writeChangelog(testDir, SAMPLE_CHANGELOG);

    const result = getChangelogPath(testDir);

    assert.ok(result !== null, 'Should find changelog');
    assert.ok(result.includes('DOCUMENTATION'), 'Should be in DOCUMENTATION directory');
    assert.ok(result.endsWith('claude-code-changelog.md'), 'Should have correct filename');
  });

  test('getChangelogPath returns null when changelog not found', () => {
    const result = getChangelogPath(testDir);
    assert.strictEqual(result, null, 'Should return null when not found');
  });

  test('getAckStorePath returns correct path', () => {
    const result = getAckStorePath(testDir);
    assert.ok(result.includes('.claude'), 'Should be in .claude directory');
    assert.ok(result.endsWith('changelog-ack-store.json'), 'Should have correct filename');
  });

  // -------------------------------------------------------------------------
  // Test 2: Update Checking
  // -------------------------------------------------------------------------
  test('checkForUpdates detects new entries with empty ack store', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);
    const ackStore = loadAckStore(ackStorePath);

    const result = await checkForUpdates(changelogPath, ackStore);

    assert.strictEqual(result.hasUpdates, true, 'Should detect updates');
    assert.ok(result.newEntries.length > 0, 'Should have new entries');
    assert.strictEqual(result.toVersion, '2.1.22', 'Should have correct latest version');
    assert.strictEqual(result.fromVersion, null, 'Should have null from version for empty store');
  });

  test('checkForUpdates throws when changelog not found', async () => {
    const ackStore: AckStore = { version: '1.0.0', lastChecked: 0, records: {} };
    const nonExistentPath = path.join(testDir, 'nonexistent.md');

    await assert.rejects(
      () => checkForUpdates(nonExistentPath, ackStore),
      /not found/,
      'Should throw when changelog not found'
    );
  });

  // -------------------------------------------------------------------------
  // Test 3: Integration Factory
  // -------------------------------------------------------------------------
  test('createIntegration creates integration with correct methods', () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);

    assert.ok(typeof integration.checkForUpdates === 'function', 'Should have checkForUpdates');
    assert.ok(typeof integration.processUpdates === 'function', 'Should have processUpdates');
    assert.ok(typeof integration.runUpdateCycle === 'function', 'Should have runUpdateCycle');
    assert.ok(typeof integration.getTracker === 'function', 'Should have getTracker');
    assert.ok(typeof integration.getConfig === 'function', 'Should have getConfig');
    assert.ok(typeof integration.getGroups === 'function', 'Should have getGroups');
    assert.ok(typeof integration.formatSummary === 'function', 'Should have formatSummary');
  });

  test('createIntegration checkForUpdates returns UpdateCheckResult', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const result = await integration.checkForUpdates();

    assert.strictEqual(result.hasUpdates, true, 'Should have updates');
    assert.ok(Array.isArray(result.newEntries), 'Should have newEntries array');
    assert.strictEqual(result.toVersion, '2.1.22', 'Should have correct toVersion');
  });

  // -------------------------------------------------------------------------
  // Test 4: Integration Hooks
  // -------------------------------------------------------------------------
  test('createIntegration calls onNewUpdates hook when updates found', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    let hookCalled = false;
    let hookResult: UpdateCheckResult | null = null;

    const hooks: IntegrationHooks = {
      onNewUpdates: (result) => {
        hookCalled = true;
        hookResult = result;
      },
    };

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config, hooks);
    await integration.checkForUpdates();

    assert.strictEqual(hookCalled, true, 'Hook should be called');
    assert.ok(hookResult !== null, 'Hook should receive result');
    assert.strictEqual(hookResult!.hasUpdates, true, 'Result should have updates');
  });

  test('createIntegration calls onError hook on failure', async () => {
    const ackStorePath = createEmptyAckStore(testDir);

    let errorCaught: Error | null = null;

    const hooks: IntegrationHooks = {
      onError: (err) => {
        errorCaught = err;
      },
    };

    const config: IntegrationConfig = {
      changelogPath: '/nonexistent/path.md',
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config, hooks);

    try {
      await integration.checkForUpdates();
    } catch {
      // Expected to throw
    }

    assert.ok(errorCaught !== null, 'Error hook should be called');
    assert.ok(errorCaught!.message.includes('not found'), 'Should have correct error message');
  });

  // -------------------------------------------------------------------------
  // Test 5: Update Cycle
  // -------------------------------------------------------------------------
  test('runUpdateCycle returns correct result structure', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const result = await runUpdateCycle(config);

    assert.ok('hasUpdates' in result, 'Should have hasUpdates');
    assert.ok('checkResult' in result, 'Should have checkResult');
    assert.ok('groups' in result, 'Should have groups');
    assert.ok('summary' in result, 'Should have summary');

    assert.strictEqual(result.hasUpdates, true, 'Should have updates');
    assert.ok(result.groups.length > 0, 'Should have presentation groups');
    assert.ok(result.summary.includes('changelog update'), 'Summary should mention updates');
  });

  test('runUpdateCycle returns no updates when all acknowledged', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG_SMALL);
    const ackStorePath = path.join(testDir, '.claude', 'changelog-ack-store.json');

    // First, acknowledge all updates
    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    acknowledgeAll(testDir);

    // Now check again
    const result = await runUpdateCycle(config);

    assert.strictEqual(result.hasUpdates, false, 'Should have no updates');
    assert.strictEqual(result.groups.length, 0, 'Should have no groups');
    assert.ok(result.summary.includes('No new'), 'Summary should say no updates');
  });

  // -------------------------------------------------------------------------
  // Test 6: Initialization
  // -------------------------------------------------------------------------
  test('initializeUpdater creates necessary structure', () => {
    writeChangelog(testDir, SAMPLE_CHANGELOG);

    const result = initializeUpdater(testDir);

    assert.ok(result.config, 'Should have config');
    assert.ok(result.tracker, 'Should have tracker');
    assert.strictEqual(result.changelogFound, true, 'Should find changelog');

    assert.ok(result.config.changelogPath.includes('DOCUMENTATION'), 'Config should have changelog path');
    assert.ok(result.config.ackStorePath.includes('.claude'), 'Config should have ack store path');
    assert.strictEqual(result.config.autoCheck, true, 'Auto check should be enabled');
  });

  test('initializeUpdater handles missing changelog', () => {
    const result = initializeUpdater(testDir);

    assert.strictEqual(result.changelogFound, false, 'Should not find changelog');
    assert.ok(result.config.changelogPath, 'Should still have default changelog path');
  });

  // -------------------------------------------------------------------------
  // Test 7: Convenience Functions
  // -------------------------------------------------------------------------
  test('hasUpdatesAvailable returns true when updates exist', async () => {
    writeChangelog(testDir, SAMPLE_CHANGELOG);
    createEmptyAckStore(testDir);

    const result = await hasUpdatesAvailable(testDir);

    assert.strictEqual(result, true, 'Should have updates available');
  });

  test('hasUpdatesAvailable returns false when no changelog', async () => {
    const result = await hasUpdatesAvailable(testDir);

    assert.strictEqual(result, false, 'Should not have updates when no changelog');
  });

  test('getUpdateSummary returns formatted summary', async () => {
    writeChangelog(testDir, SAMPLE_CHANGELOG);
    createEmptyAckStore(testDir);

    const summary = await getUpdateSummary(testDir);

    assert.ok(summary !== null, 'Should return summary');
    assert.ok(summary.includes('Updates'), 'Summary should mention updates');
    assert.ok(summary.includes('2.1.22'), 'Summary should include version');
  });

  test('getUpdateSummary returns null when no changelog', async () => {
    const summary = await getUpdateSummary(testDir);
    assert.strictEqual(summary, null, 'Should return null when no changelog');
  });

  // -------------------------------------------------------------------------
  // Test 8: Acknowledge All
  // -------------------------------------------------------------------------
  test('acknowledgeAll marks all entries as seen', async () => {
    writeChangelog(testDir, SAMPLE_CHANGELOG_SMALL);
    const ackStorePath = createEmptyAckStore(testDir);

    // Verify updates exist before acknowledging
    const ackStore = loadAckStore(ackStorePath);
    const changelogPath = getChangelogPath(testDir)!;
    const resultBefore = await checkForUpdates(changelogPath, ackStore);
    assert.ok(resultBefore.hasUpdates, 'Should have updates before acknowledging');

    // Acknowledge all
    acknowledgeAll(testDir);

    // Verify no updates after acknowledging
    const ackStoreAfter = loadAckStore(ackStorePath);
    const resultAfter = await checkForUpdates(changelogPath, ackStoreAfter);
    assert.strictEqual(resultAfter.hasUpdates, false, 'Should have no updates after acknowledging');
  });

  // -------------------------------------------------------------------------
  // Test 9: Integration getGroups and formatSummary
  // -------------------------------------------------------------------------
  test('integration.getGroups returns presentation groups', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const checkResult = await integration.checkForUpdates();
    const groups = integration.getGroups(checkResult.newEntries);

    assert.ok(Array.isArray(groups), 'Should return array');
    assert.ok(groups.length > 0, 'Should have groups');

    // Check group structure
    const group = groups[0];
    assert.ok('icon' in group, 'Group should have icon');
    assert.ok('title' in group, 'Group should have title');
    assert.ok('entries' in group, 'Group should have entries');
    assert.ok('actions' in group, 'Group should have actions');
  });

  test('integration.formatSummary returns formatted string', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const checkResult = await integration.checkForUpdates();
    const summary = integration.formatSummary(
      checkResult.newEntries,
      checkResult.fromVersion,
      checkResult.toVersion
    );

    assert.ok(typeof summary === 'string', 'Should return string');
    assert.ok(summary.length > 0, 'Should not be empty');
    assert.ok(summary.includes('Updates'), 'Should include Updates header');
  });

  // -------------------------------------------------------------------------
  // Test 10: Integration getConfig and getTracker
  // -------------------------------------------------------------------------
  test('integration.getConfig returns config copy', () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const returnedConfig = integration.getConfig();

    assert.deepStrictEqual(returnedConfig.changelogPath, config.changelogPath);
    assert.deepStrictEqual(returnedConfig.ackStorePath, config.ackStorePath);
    assert.deepStrictEqual(returnedConfig.autoCheck, config.autoCheck);

    // Verify it's a copy (modifying doesn't affect original)
    returnedConfig.autoCheck = false;
    const returnedConfig2 = integration.getConfig();
    assert.strictEqual(returnedConfig2.autoCheck, true, 'Original should be unchanged');
  });

  test('integration.getTracker returns AckTracker instance', () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const tracker = integration.getTracker();

    assert.ok(typeof tracker.load === 'function', 'Should have load method');
    assert.ok(typeof tracker.save === 'function', 'Should have save method');
    assert.ok(typeof tracker.check === 'function', 'Should have check method');
    assert.ok(typeof tracker.ack === 'function', 'Should have ack method');
    assert.ok(typeof tracker.filter === 'function', 'Should have filter method');
    assert.ok(typeof tracker.getStore === 'function', 'Should have getStore method');
    assert.ok(typeof tracker.getStats === 'function', 'Should have getStats method');
  });

  // -------------------------------------------------------------------------
  // Test 11: Process Updates (dry run)
  // -------------------------------------------------------------------------
  test('integration.processUpdates works in dry run mode', async () => {
    const changelogPath = writeChangelog(testDir, SAMPLE_CHANGELOG);
    const ackStorePath = createEmptyAckStore(testDir);

    const config: IntegrationConfig = {
      changelogPath,
      ackStorePath,
      autoCheck: true,
    };

    const integration = createIntegration(config);
    const checkResult = await integration.checkForUpdates();

    // Create user choices map
    const userChoices = new Map<string, UserAction>();
    for (const entry of checkResult.newEntries) {
      userChoices.set(`${entry.original.version}-${entry.original.content.substring(0, 8)}`, 'acknowledge');
    }

    const report = await integration.processUpdates(
      checkResult.newEntries,
      userChoices,
      { dryRun: true }
    );

    assert.ok(report.totalEntries > 0, 'Should have entries');
    assert.ok('successful' in report, 'Should have successful count');
    assert.ok('failed' in report, 'Should have failed count');
    assert.ok('results' in report, 'Should have results array');
  });

  // -------------------------------------------------------------------------
  // Test 12: resolveProjectRoot
  // -------------------------------------------------------------------------
  test('resolveProjectRoot finds project root with .claude directory', () => {
    // testDir already has .claude directory
    const result = resolveProjectRoot(testDir);
    assert.strictEqual(result, testDir, 'Should return directory with .claude');
  });

  test('resolveProjectRoot uses fallback when no markers found', () => {
    const emptyDir = path.join('/tmp', `empty-test-${Date.now()}`);
    fs.mkdirSync(emptyDir, { recursive: true });

    try {
      const result = resolveProjectRoot(emptyDir);
      // Should return the start path as fallback
      assert.ok(result === emptyDir || result.startsWith('/'), 'Should return valid path');
    } finally {
      cleanupTestDir(emptyDir);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Run tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('Running integration tests...');

/**
 * Tests for Acknowledgment Tracking Module (feat-009)
 *
 * Run with: npx tsx --test ack-tracker.test.ts
 */

import { test, describe, beforeEach, afterEach } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import {
  generateEntryId,
  loadAckStore,
  saveAckStore,
  isAcknowledged,
  getAcknowledgment,
  acknowledge,
  acknowledgeMany,
  getUnacknowledged,
  getEntriesByStatus,
  clearOldRecords,
  getStoreStats,
  createAckTracker,
  type AckStore,
  type AcknowledgmentStatus,
} from './ack-tracker';

import type { ParsedEntry } from './entry-parser';
import type { ChangelogEntry } from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

function createMockChangelogEntry(overrides: Partial<ChangelogEntry> = {}): ChangelogEntry {
  return {
    version: '1.0.50',
    date: '2025-01-15',
    section: 'Added',
    content: 'Added new environment variable `CLAUDE_API_KEY` for authentication',
    rawLine: '- Added new environment variable `CLAUDE_API_KEY` for authentication',
    ...overrides,
  };
}

function createMockParsedEntry(overrides: Partial<ParsedEntry> = {}): ParsedEntry {
  return {
    original: createMockChangelogEntry(overrides.original),
    category: 'config',
    actionRequired: true,
    actionType: 'config_update',
    extractedDetails: { envVars: ['CLAUDE_API_KEY'] },
    confidence: 0.85,
    ...overrides,
  };
}

function createEmptyStore(): AckStore {
  return {
    version: '1.0.0',
    lastChecked: 0,
    records: {},
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────────────────

describe('generateEntryId', () => {
  test('produces consistent IDs for same entry', () => {
    const entry = createMockParsedEntry();
    const id1 = generateEntryId(entry);
    const id2 = generateEntryId(entry);

    assert.strictEqual(id1, id2, 'Same entry should produce same ID');
  });

  test('includes version in ID', () => {
    const entry = createMockParsedEntry({
      original: createMockChangelogEntry({ version: '1.0.55' }),
    });
    const id = generateEntryId(entry);

    assert.ok(id.startsWith('1.0.55:'), 'ID should start with version');
  });

  test('produces different IDs for different content', () => {
    const entry1 = createMockParsedEntry({
      original: createMockChangelogEntry({ content: 'First entry content' }),
    });
    const entry2 = createMockParsedEntry({
      original: createMockChangelogEntry({ content: 'Second entry content' }),
    });

    const id1 = generateEntryId(entry1);
    const id2 = generateEntryId(entry2);

    assert.notStrictEqual(id1, id2, 'Different content should produce different IDs');
  });

  test('produces different IDs for same content in different versions', () => {
    const entry1 = createMockParsedEntry({
      original: createMockChangelogEntry({ version: '1.0.50', content: 'Same content' }),
    });
    const entry2 = createMockParsedEntry({
      original: createMockChangelogEntry({ version: '1.0.51', content: 'Same content' }),
    });

    const id1 = generateEntryId(entry1);
    const id2 = generateEntryId(entry2);

    assert.notStrictEqual(id1, id2, 'Same content in different versions should produce different IDs');
  });
});

describe('loadAckStore', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ack-tracker-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('returns empty store for missing file', () => {
    const storePath = path.join(tempDir, 'nonexistent.json');
    const store = loadAckStore(storePath);

    assert.strictEqual(store.version, '1.0.0');
    assert.strictEqual(store.lastChecked, 0);
    assert.deepStrictEqual(store.records, {});
  });

  test('loads valid JSON store', () => {
    const storePath = path.join(tempDir, 'store.json');
    const testStore: AckStore = {
      version: '1.0.0',
      lastChecked: 1700000000000,
      records: {
        '1.0.50:abc12345': {
          entryId: '1.0.50:abc12345',
          status: 'seen',
          timestamp: 1700000000000,
          version: '1.0.50',
        },
      },
    };

    fs.writeFileSync(storePath, JSON.stringify(testStore), 'utf-8');
    const loaded = loadAckStore(storePath);

    assert.deepStrictEqual(loaded, testStore);
  });

  test('returns empty store for invalid JSON', () => {
    const storePath = path.join(tempDir, 'invalid.json');
    fs.writeFileSync(storePath, 'not valid json', 'utf-8');

    const store = loadAckStore(storePath);

    assert.strictEqual(store.version, '1.0.0');
    assert.deepStrictEqual(store.records, {});
  });

  test('returns empty store for malformed structure', () => {
    const storePath = path.join(tempDir, 'malformed.json');
    fs.writeFileSync(storePath, JSON.stringify({ foo: 'bar' }), 'utf-8');

    const store = loadAckStore(storePath);

    assert.strictEqual(store.version, '1.0.0');
    assert.deepStrictEqual(store.records, {});
  });
});

describe('saveAckStore', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ack-tracker-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('writes valid JSON to path', () => {
    const storePath = path.join(tempDir, 'output.json');
    const store: AckStore = {
      version: '1.0.0',
      lastChecked: 1700000000000,
      records: {
        'test:id': {
          entryId: 'test:id',
          status: 'applied',
          timestamp: 1700000000000,
          version: '1.0.50',
        },
      },
    };

    saveAckStore(storePath, store);

    assert.ok(fs.existsSync(storePath), 'File should exist');

    const content = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(content);
    assert.deepStrictEqual(parsed, store);
  });

  test('creates parent directories if needed', () => {
    const storePath = path.join(tempDir, 'nested', 'dir', 'store.json');
    const store = createEmptyStore();

    saveAckStore(storePath, store);

    assert.ok(fs.existsSync(storePath), 'File should exist in nested directory');
  });

  test('overwrites existing file', () => {
    const storePath = path.join(tempDir, 'overwrite.json');

    const store1: AckStore = { ...createEmptyStore(), lastChecked: 100 };
    const store2: AckStore = { ...createEmptyStore(), lastChecked: 200 };

    saveAckStore(storePath, store1);
    saveAckStore(storePath, store2);

    const content = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(content);
    assert.strictEqual(parsed.lastChecked, 200);
  });
});

describe('isAcknowledged', () => {
  test('returns false for missing entry', () => {
    const store = createEmptyStore();
    const result = isAcknowledged(store, 'nonexistent:id');

    assert.strictEqual(result, false);
  });

  test('returns true for existing entry', () => {
    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        'existing:id': {
          entryId: 'existing:id',
          status: 'seen',
          timestamp: Date.now(),
          version: '1.0.50',
        },
      },
    };

    const result = isAcknowledged(store, 'existing:id');
    assert.strictEqual(result, true);
  });

  test('returns true for all status types', () => {
    const statuses: AcknowledgmentStatus[] = ['seen', 'applied', 'skipped', 'dismissed'];

    for (const status of statuses) {
      const store: AckStore = {
        ...createEmptyStore(),
        records: {
          'test:id': {
            entryId: 'test:id',
            status,
            timestamp: Date.now(),
            version: '1.0.50',
          },
        },
      };

      const result = isAcknowledged(store, 'test:id');
      assert.strictEqual(result, true, `Should be acknowledged for status: ${status}`);
    }
  });
});

describe('acknowledge', () => {
  test('adds record with correct timestamp', () => {
    const store = createEmptyStore();
    const before = Date.now();

    const updated = acknowledge(store, 'new:id', 'seen', '1.0.50');

    const after = Date.now();
    const record = updated.records['new:id'];

    assert.ok(record, 'Record should exist');
    assert.strictEqual(record.entryId, 'new:id');
    assert.strictEqual(record.status, 'seen');
    assert.strictEqual(record.version, '1.0.50');
    assert.ok(record.timestamp >= before && record.timestamp <= after, 'Timestamp should be current');
  });

  test('does not mutate original store', () => {
    const store = createEmptyStore();
    const originalRecordCount = Object.keys(store.records).length;

    acknowledge(store, 'new:id', 'applied', '1.0.50');

    assert.strictEqual(Object.keys(store.records).length, originalRecordCount, 'Original store should not be mutated');
  });

  test('updates lastChecked timestamp', () => {
    const store = createEmptyStore();
    const before = Date.now();

    const updated = acknowledge(store, 'new:id', 'seen', '1.0.50');

    assert.ok(updated.lastChecked >= before, 'lastChecked should be updated');
  });

  test('overwrites existing record', () => {
    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        'existing:id': {
          entryId: 'existing:id',
          status: 'seen',
          timestamp: 1000,
          version: '1.0.49',
        },
      },
    };

    const updated = acknowledge(store, 'existing:id', 'applied', '1.0.50');

    assert.strictEqual(updated.records['existing:id'].status, 'applied');
    assert.strictEqual(updated.records['existing:id'].version, '1.0.50');
    assert.ok(updated.records['existing:id'].timestamp > 1000, 'Timestamp should be updated');
  });
});

describe('acknowledgeMany', () => {
  test('acknowledges multiple entries at once', () => {
    const store = createEmptyStore();
    const entries = [
      { entryId: 'id1', status: 'seen' as AcknowledgmentStatus, version: '1.0.50' },
      { entryId: 'id2', status: 'applied' as AcknowledgmentStatus, version: '1.0.50' },
      { entryId: 'id3', status: 'skipped' as AcknowledgmentStatus, version: '1.0.51' },
    ];

    const updated = acknowledgeMany(store, entries);

    assert.strictEqual(Object.keys(updated.records).length, 3);
    assert.strictEqual(updated.records['id1'].status, 'seen');
    assert.strictEqual(updated.records['id2'].status, 'applied');
    assert.strictEqual(updated.records['id3'].status, 'skipped');
  });
});

describe('getUnacknowledged', () => {
  test('filters correctly to unseen entries', () => {
    const entries: ParsedEntry[] = [
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 1' }) }),
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 2' }) }),
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 3' }) }),
    ];

    // Acknowledge the first entry
    const acknowledgedId = generateEntryId(entries[0]);
    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        [acknowledgedId]: {
          entryId: acknowledgedId,
          status: 'seen',
          timestamp: Date.now(),
          version: '1.0.50',
        },
      },
    };

    const unacked = getUnacknowledged(entries, store);

    assert.strictEqual(unacked.length, 2, 'Should return 2 unacknowledged entries');
    assert.ok(
      unacked.every((e) => e.original.content !== 'Entry 1'),
      'Should not include acknowledged entry'
    );
  });

  test('returns all entries when store is empty', () => {
    const entries: ParsedEntry[] = [
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 1' }) }),
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 2' }) }),
    ];

    const unacked = getUnacknowledged(entries, createEmptyStore());

    assert.strictEqual(unacked.length, 2, 'Should return all entries');
  });

  test('returns empty array when all entries are acknowledged', () => {
    const entries: ParsedEntry[] = [
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry 1' }) }),
    ];

    const acknowledgedId = generateEntryId(entries[0]);
    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        [acknowledgedId]: {
          entryId: acknowledgedId,
          status: 'applied',
          timestamp: Date.now(),
          version: '1.0.50',
        },
      },
    };

    const unacked = getUnacknowledged(entries, store);

    assert.strictEqual(unacked.length, 0, 'Should return empty array');
  });
});

describe('clearOldRecords', () => {
  test('removes records older than specified days', () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        old: {
          entryId: 'old',
          status: 'seen',
          timestamp: now - 40 * dayInMs, // 40 days ago
          version: '1.0.40',
        },
        recent: {
          entryId: 'recent',
          status: 'applied',
          timestamp: now - 10 * dayInMs, // 10 days ago
          version: '1.0.50',
        },
      },
    };

    const cleaned = clearOldRecords(store, 30);

    assert.strictEqual(Object.keys(cleaned.records).length, 1);
    assert.ok('recent' in cleaned.records, 'Recent record should remain');
    assert.ok(!('old' in cleaned.records), 'Old record should be removed');
  });

  test('keeps all records when none are old enough', () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        record1: {
          entryId: 'record1',
          status: 'seen',
          timestamp: now - 5 * dayInMs,
          version: '1.0.50',
        },
        record2: {
          entryId: 'record2',
          status: 'applied',
          timestamp: now - 10 * dayInMs,
          version: '1.0.49',
        },
      },
    };

    const cleaned = clearOldRecords(store, 30);

    assert.strictEqual(Object.keys(cleaned.records).length, 2);
  });

  test('removes all records when all are old', () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        old1: {
          entryId: 'old1',
          status: 'seen',
          timestamp: now - 100 * dayInMs,
          version: '1.0.10',
        },
        old2: {
          entryId: 'old2',
          status: 'applied',
          timestamp: now - 90 * dayInMs,
          version: '1.0.20',
        },
      },
    };

    const cleaned = clearOldRecords(store, 30);

    assert.strictEqual(Object.keys(cleaned.records).length, 0);
  });

  test('does not mutate original store', () => {
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        old: {
          entryId: 'old',
          status: 'seen',
          timestamp: now - 40 * dayInMs,
          version: '1.0.40',
        },
      },
    };

    clearOldRecords(store, 30);

    assert.strictEqual(Object.keys(store.records).length, 1, 'Original store should not be mutated');
  });
});

describe('getStoreStats', () => {
  test('returns correct statistics', () => {
    const now = Date.now();
    const store: AckStore = {
      ...createEmptyStore(),
      records: {
        id1: { entryId: 'id1', status: 'seen', timestamp: now - 1000, version: '1.0.50' },
        id2: { entryId: 'id2', status: 'seen', timestamp: now - 2000, version: '1.0.50' },
        id3: { entryId: 'id3', status: 'applied', timestamp: now - 500, version: '1.0.51' },
        id4: { entryId: 'id4', status: 'skipped', timestamp: now - 3000, version: '1.0.49' },
      },
    };

    const stats = getStoreStats(store);

    assert.strictEqual(stats.totalRecords, 4);
    assert.strictEqual(stats.byStatus.seen, 2);
    assert.strictEqual(stats.byStatus.applied, 1);
    assert.strictEqual(stats.byStatus.skipped, 1);
    assert.strictEqual(stats.byStatus.dismissed, 0);
    assert.strictEqual(stats.oldestRecord, now - 3000);
    assert.strictEqual(stats.newestRecord, now - 500);
  });

  test('handles empty store', () => {
    const stats = getStoreStats(createEmptyStore());

    assert.strictEqual(stats.totalRecords, 0);
    assert.strictEqual(stats.oldestRecord, null);
    assert.strictEqual(stats.newestRecord, null);
  });
});

describe('createAckTracker factory', () => {
  let tempDir: string;
  let storePath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ack-tracker-factory-test-'));
    storePath = path.join(tempDir, 'tracker-store.json');
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('creates tracker with all methods', () => {
    const tracker = createAckTracker({ storePath });

    assert.ok(typeof tracker.load === 'function');
    assert.ok(typeof tracker.save === 'function');
    assert.ok(typeof tracker.check === 'function');
    assert.ok(typeof tracker.ack === 'function');
    assert.ok(typeof tracker.filter === 'function');
    assert.ok(typeof tracker.cleanup === 'function');
    assert.ok(typeof tracker.getStore === 'function');
    assert.ok(typeof tracker.getStats === 'function');
  });

  test('tracker.check returns correct value', () => {
    const tracker = createAckTracker({ storePath });

    assert.strictEqual(tracker.check('nonexistent:id'), false);

    tracker.ack('test:id', 'seen', '1.0.50');

    assert.strictEqual(tracker.check('test:id'), true);
  });

  test('tracker.ack persists to disk', () => {
    const tracker = createAckTracker({ storePath });
    tracker.ack('test:id', 'applied', '1.0.50');

    // Create new tracker instance to verify persistence
    const tracker2 = createAckTracker({ storePath });
    assert.strictEqual(tracker2.check('test:id'), true);
  });

  test('tracker.filter returns unacknowledged entries', () => {
    const tracker = createAckTracker({ storePath });
    const entries: ParsedEntry[] = [
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry A' }) }),
      createMockParsedEntry({ original: createMockChangelogEntry({ content: 'Entry B' }) }),
    ];

    // Acknowledge first entry
    const id = generateEntryId(entries[0]);
    tracker.ack(id, 'seen', '1.0.50');

    const unacked = tracker.filter(entries);

    assert.strictEqual(unacked.length, 1);
    assert.strictEqual(unacked[0].original.content, 'Entry B');
  });

  test('tracker.cleanup removes old records', () => {
    // Create store with old record
    const oldStore: AckStore = {
      version: '1.0.0',
      lastChecked: Date.now(),
      records: {
        old: {
          entryId: 'old',
          status: 'seen',
          timestamp: Date.now() - 100 * 24 * 60 * 60 * 1000, // 100 days ago
          version: '1.0.30',
        },
        recent: {
          entryId: 'recent',
          status: 'applied',
          timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
          version: '1.0.50',
        },
      },
    };

    fs.writeFileSync(storePath, JSON.stringify(oldStore), 'utf-8');

    const tracker = createAckTracker({ storePath });
    tracker.cleanup(30);

    const store = tracker.getStore();
    assert.strictEqual(Object.keys(store.records).length, 1);
    assert.ok(!('old' in store.records));
    assert.ok('recent' in store.records);
  });

  test('tracker.getStats returns correct statistics', () => {
    const tracker = createAckTracker({ storePath });

    tracker.ack('id1', 'seen', '1.0.50');
    tracker.ack('id2', 'applied', '1.0.50');
    tracker.ack('id3', 'skipped', '1.0.51');

    const stats = tracker.getStats();

    assert.strictEqual(stats.totalRecords, 3);
    assert.strictEqual(stats.byStatus.seen, 1);
    assert.strictEqual(stats.byStatus.applied, 1);
    assert.strictEqual(stats.byStatus.skipped, 1);
  });

  test('tracker.load reloads from disk', () => {
    const tracker = createAckTracker({ storePath });
    tracker.ack('original:id', 'seen', '1.0.50');

    // Manually modify the file
    const manualStore: AckStore = {
      version: '1.0.0',
      lastChecked: Date.now(),
      records: {
        'manual:id': {
          entryId: 'manual:id',
          status: 'applied',
          timestamp: Date.now(),
          version: '1.0.51',
        },
      },
    };
    fs.writeFileSync(storePath, JSON.stringify(manualStore), 'utf-8');

    // Reload and verify
    tracker.load();
    assert.strictEqual(tracker.check('original:id'), false);
    assert.strictEqual(tracker.check('manual:id'), true);
  });
});

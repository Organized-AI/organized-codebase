/**
 * Acknowledgment Tracking Module (feat-009)
 *
 * Tracks which changelog entries have been seen, applied, skipped, or dismissed
 * by the user. Persists state to a JSON file for cross-session memory.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

import type { ParsedEntry } from './entry-parser';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type AcknowledgmentStatus = 'seen' | 'applied' | 'skipped' | 'dismissed';

export interface AcknowledgmentRecord {
  entryId: string;
  status: AcknowledgmentStatus;
  timestamp: number;
  version: string;
}

export interface AckTrackerOptions {
  storePath: string;
}

export interface AckStore {
  version: string;
  lastChecked: number;
  records: Record<string, AcknowledgmentRecord>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORE_VERSION = '1.0.0';

const DEFAULT_STORE: AckStore = {
  version: STORE_VERSION,
  lastChecked: 0,
  records: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Entry ID Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a unique ID for a changelog entry
 * Combines version and content hash for uniqueness
 */
export function generateEntryId(entry: ParsedEntry): string {
  const version = entry.original.version;
  const content = entry.original.content;

  // Create a hash of the content for uniqueness within a version
  const contentHash = crypto
    .createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 8);

  return `${version}:${contentHash}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load acknowledgment store from disk
 * Returns empty store if file doesn't exist or is invalid
 */
export function loadAckStore(storePath: string): AckStore {
  try {
    if (!fs.existsSync(storePath)) {
      return { ...DEFAULT_STORE };
    }

    const content = fs.readFileSync(storePath, 'utf-8');
    const parsed = JSON.parse(content);

    // Validate structure
    if (
      typeof parsed !== 'object' ||
      typeof parsed.version !== 'string' ||
      typeof parsed.lastChecked !== 'number' ||
      typeof parsed.records !== 'object'
    ) {
      console.warn('[ack-tracker] Invalid store format, returning empty store');
      return { ...DEFAULT_STORE };
    }

    return parsed as AckStore;
  } catch (error) {
    console.warn('[ack-tracker] Failed to load store:', error);
    return { ...DEFAULT_STORE };
  }
}

/**
 * Save acknowledgment store to disk
 * Creates parent directories if needed
 */
export function saveAckStore(storePath: string, store: AckStore): void {
  const dir = path.dirname(storePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = JSON.stringify(store, null, 2);
  fs.writeFileSync(storePath, content, 'utf-8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Acknowledgment Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Check if an entry has been acknowledged (seen, applied, or dismissed)
 */
export function isAcknowledged(store: AckStore, entryId: string): boolean {
  return entryId in store.records;
}

/**
 * Get the acknowledgment record for an entry
 */
export function getAcknowledgment(
  store: AckStore,
  entryId: string
): AcknowledgmentRecord | undefined {
  return store.records[entryId];
}

/**
 * Add or update an acknowledgment record
 * Returns the updated store (does not mutate original)
 */
export function acknowledge(
  store: AckStore,
  entryId: string,
  status: AcknowledgmentStatus,
  version: string
): AckStore {
  const record: AcknowledgmentRecord = {
    entryId,
    status,
    timestamp: Date.now(),
    version,
  };

  return {
    ...store,
    lastChecked: Date.now(),
    records: {
      ...store.records,
      [entryId]: record,
    },
  };
}

/**
 * Acknowledge multiple entries at once
 */
export function acknowledgeMany(
  store: AckStore,
  entries: Array<{ entryId: string; status: AcknowledgmentStatus; version: string }>
): AckStore {
  const newRecords = { ...store.records };
  const now = Date.now();

  for (const entry of entries) {
    newRecords[entry.entryId] = {
      entryId: entry.entryId,
      status: entry.status,
      timestamp: now,
      version: entry.version,
    };
  }

  return {
    ...store,
    lastChecked: now,
    records: newRecords,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Filtering Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter entries to only those that haven't been acknowledged
 */
export function getUnacknowledged(
  entries: ParsedEntry[],
  store: AckStore
): ParsedEntry[] {
  return entries.filter((entry) => {
    const entryId = generateEntryId(entry);
    return !isAcknowledged(store, entryId);
  });
}

/**
 * Get entries with a specific acknowledgment status
 */
export function getEntriesByStatus(
  entries: ParsedEntry[],
  store: AckStore,
  status: AcknowledgmentStatus
): ParsedEntry[] {
  return entries.filter((entry) => {
    const entryId = generateEntryId(entry);
    const record = store.records[entryId];
    return record?.status === status;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Cleanup Operations
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Remove acknowledgment records older than specified days
 * Returns the updated store (does not mutate original)
 */
export function clearOldRecords(store: AckStore, olderThanDays: number): AckStore {
  const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
  const newRecords: Record<string, AcknowledgmentRecord> = {};

  for (const [id, record] of Object.entries(store.records)) {
    if (record.timestamp >= cutoffTime) {
      newRecords[id] = record;
    }
  }

  return {
    ...store,
    records: newRecords,
  };
}

/**
 * Get statistics about the store
 */
export function getStoreStats(store: AckStore): {
  totalRecords: number;
  byStatus: Record<AcknowledgmentStatus, number>;
  oldestRecord: number | null;
  newestRecord: number | null;
} {
  const byStatus: Record<AcknowledgmentStatus, number> = {
    seen: 0,
    applied: 0,
    skipped: 0,
    dismissed: 0,
  };

  let oldest: number | null = null;
  let newest: number | null = null;

  for (const record of Object.values(store.records)) {
    byStatus[record.status]++;

    if (oldest === null || record.timestamp < oldest) {
      oldest = record.timestamp;
    }
    if (newest === null || record.timestamp > newest) {
      newest = record.timestamp;
    }
  }

  return {
    totalRecords: Object.keys(store.records).length,
    byStatus,
    oldestRecord: oldest,
    newestRecord: newest,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory Function
// ─────────────────────────────────────────────────────────────────────────────

export interface AckTracker {
  load: () => AckStore;
  save: (store: AckStore) => void;
  check: (entryId: string) => boolean;
  ack: (entryId: string, status: AcknowledgmentStatus, version: string) => void;
  filter: (entries: ParsedEntry[]) => ParsedEntry[];
  cleanup: (olderThanDays: number) => void;
  getStore: () => AckStore;
  getStats: () => ReturnType<typeof getStoreStats>;
}

/**
 * Create an acknowledgment tracker instance
 * Provides a convenient API for managing acknowledgments
 */
export function createAckTracker(opts: AckTrackerOptions): AckTracker {
  let currentStore: AckStore = loadAckStore(opts.storePath);

  return {
    /**
     * Reload store from disk
     */
    load(): AckStore {
      currentStore = loadAckStore(opts.storePath);
      return currentStore;
    },

    /**
     * Save current store to disk
     */
    save(store?: AckStore): void {
      if (store) {
        currentStore = store;
      }
      saveAckStore(opts.storePath, currentStore);
    },

    /**
     * Check if an entry ID has been acknowledged
     */
    check(entryId: string): boolean {
      return isAcknowledged(currentStore, entryId);
    },

    /**
     * Acknowledge an entry and save
     */
    ack(entryId: string, status: AcknowledgmentStatus, version: string): void {
      currentStore = acknowledge(currentStore, entryId, status, version);
      saveAckStore(opts.storePath, currentStore);
    },

    /**
     * Filter entries to unacknowledged ones
     */
    filter(entries: ParsedEntry[]): ParsedEntry[] {
      return getUnacknowledged(entries, currentStore);
    },

    /**
     * Remove old records and save
     */
    cleanup(olderThanDays: number): void {
      currentStore = clearOldRecords(currentStore, olderThanDays);
      saveAckStore(opts.storePath, currentStore);
    },

    /**
     * Get current store
     */
    getStore(): AckStore {
      return currentStore;
    },

    /**
     * Get store statistics
     */
    getStats(): ReturnType<typeof getStoreStats> {
      return getStoreStats(currentStore);
    },
  };
}

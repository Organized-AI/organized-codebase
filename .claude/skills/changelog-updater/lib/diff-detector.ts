/**
 * Changelog Diff Detector (feat-002)
 *
 * Compares local changelog version against user's acknowledged version
 * and identifies new entries that need to be presented.
 */

import * as fs from 'fs';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ChangelogEntry {
  version: string;
  date?: string;
  section?: string;  // 'Added' | 'Fixed' | 'Improved' | 'Changed' | 'Removed'
  content: string;
  rawLine: string;
}

export interface ChangelogMetadata {
  latestVersion: string;
  fetchedAt: string;
  totalVersions: string;
  source: string;
}

export interface UpdaterState {
  lastAcknowledgedVersion: string | null;
  acknowledgedEntries: string[];
  appliedConfigs: string[];
  skippedEntries: string[];
  lastChecked: string;
}

export interface DiffResult {
  hasUpdates: boolean;
  fromVersion: string | null;
  toVersion: string;
  newVersions: string[];
  newEntries: ChangelogEntry[];
  metadata: ChangelogMetadata;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE: UpdaterState = {
  lastAcknowledgedVersion: null,
  acknowledgedEntries: [],
  appliedConfigs: [],
  skippedEntries: [],
  lastChecked: new Date().toISOString()
};

// ─────────────────────────────────────────────────────────────────────────────
// Parsing Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse YAML frontmatter from markdown content
 */
export function parseFrontmatter(content: string): Record<string, string> {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return {};
  }

  const frontmatter: Record<string, string> = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Extract changelog metadata from frontmatter
 */
export function extractMetadata(content: string): ChangelogMetadata {
  const frontmatter = parseFrontmatter(content);

  return {
    latestVersion: frontmatter['latest_version'] || 'unknown',
    fetchedAt: frontmatter['fetched_at'] || new Date().toISOString(),
    totalVersions: frontmatter['total_versions'] || 'unknown',
    source: frontmatter['source'] || ''
  };
}

/**
 * Parse version string to comparable number array
 * e.g., "2.1.22" -> [2, 1, 22]
 */
export function parseVersion(version: string): number[] {
  const cleaned = version.replace(/^v?/, '').replace(/[^0-9.]/g, '');
  return cleaned.split('.').map(n => parseInt(n, 10) || 0);
}

/**
 * Compare two versions
 * Returns: -1 if a < b, 0 if equal, 1 if a > b
 */
export function compareVersions(a: string, b: string): number {
  const vA = parseVersion(a);
  const vB = parseVersion(b);

  const maxLen = Math.max(vA.length, vB.length);

  for (let i = 0; i < maxLen; i++) {
    const numA = vA[i] || 0;
    const numB = vB[i] || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}

/**
 * Extract all version sections and their entries from changelog content
 */
export function parseChangelogSections(content: string): Map<string, ChangelogEntry[]> {
  const sections = new Map<string, ChangelogEntry[]>();

  // Split by version headers (## 2.1.22, ## 2.1.21, etc.)
  const versionPattern = /^## (\d+\.\d+\.\d+)(?:\s+\(.*\))?/gm;
  const matches = [...content.matchAll(versionPattern)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const version = match[1];
    const startIndex = match.index! + match[0].length;
    const endIndex = matches[i + 1]?.index ?? content.length;

    const sectionContent = content.substring(startIndex, endIndex);
    const entries = parseEntriesFromSection(version, sectionContent);

    sections.set(version, entries);
  }

  return sections;
}

/**
 * Parse individual entries from a version section
 */
function parseEntriesFromSection(version: string, sectionContent: string): ChangelogEntry[] {
  const entries: ChangelogEntry[] = [];
  const lines = sectionContent.split('\n');

  let currentSection: string | undefined;

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for subsection headers (### Added, ### Fixed, etc.)
    const subsectionMatch = trimmed.match(/^###\s+(\w+)/);
    if (subsectionMatch) {
      currentSection = subsectionMatch[1];
      continue;
    }

    // Check for entry lines (- or *)
    const entryMatch = trimmed.match(/^[-*]\s+(.+)/);
    if (entryMatch) {
      entries.push({
        version,
        section: currentSection,
        content: entryMatch[1],
        rawLine: line
      });
    }
  }

  return entries;
}

// ─────────────────────────────────────────────────────────────────────────────
// State Management
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get the path to the updater state file
 */
export function getStatePath(projectRoot: string): string {
  return path.join(projectRoot, '.claude', 'changelog-updater-state.json');
}

/**
 * Load updater state from disk
 */
export function loadState(statePath: string): UpdaterState {
  try {
    if (fs.existsSync(statePath)) {
      const content = fs.readFileSync(statePath, 'utf-8');
      return { ...DEFAULT_STATE, ...JSON.parse(content) };
    }
  } catch (error) {
    console.warn('Failed to load updater state, using defaults:', error);
  }

  return { ...DEFAULT_STATE };
}

/**
 * Save updater state to disk
 */
export function saveState(statePath: string, state: UpdaterState): void {
  const dir = path.dirname(statePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Diff Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect differences between acknowledged and current changelog versions
 */
export function detectDiff(
  changelogContent: string,
  state: UpdaterState
): DiffResult {
  const metadata = extractMetadata(changelogContent);
  const sections = parseChangelogSections(changelogContent);

  const latestVersion = metadata.latestVersion;
  const lastAcknowledged = state.lastAcknowledgedVersion;

  // If no previous acknowledgment, all entries are new
  if (!lastAcknowledged) {
    const allEntries: ChangelogEntry[] = [];
    const allVersions: string[] = [];

    for (const [version, entries] of sections) {
      allVersions.push(version);
      allEntries.push(...entries);
    }

    return {
      hasUpdates: allEntries.length > 0,
      fromVersion: null,
      toVersion: latestVersion,
      newVersions: allVersions,
      newEntries: allEntries,
      metadata
    };
  }

  // Find entries newer than last acknowledged version
  const newEntries: ChangelogEntry[] = [];
  const newVersions: string[] = [];

  for (const [version, entries] of sections) {
    if (compareVersions(version, lastAcknowledged) > 0) {
      newVersions.push(version);

      // Filter out already acknowledged entries
      for (const entry of entries) {
        const entryId = `${version}-${hashEntry(entry.content)}`;
        if (!state.acknowledgedEntries.includes(entryId)) {
          newEntries.push(entry);
        }
      }
    }
  }

  // Sort versions descending (newest first)
  newVersions.sort((a, b) => compareVersions(b, a));

  return {
    hasUpdates: newEntries.length > 0,
    fromVersion: lastAcknowledged,
    toVersion: latestVersion,
    newVersions,
    newEntries,
    metadata
  };
}

/**
 * Simple hash for entry content to create stable IDs
 */
function hashEntry(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────────
// High-Level API
// ─────────────────────────────────────────────────────────────────────────────

export interface DetectUpdatesOptions {
  projectRoot: string;
  changelogPath?: string;
}

/**
 * Main entry point: detect changelog updates for a project
 */
export async function detectUpdates(options: DetectUpdatesOptions): Promise<DiffResult> {
  const { projectRoot } = options;
  const changelogPath = options.changelogPath ??
    path.join(projectRoot, 'DOCUMENTATION', 'claude-code-changelog.md');

  // Load changelog content
  if (!fs.existsSync(changelogPath)) {
    throw new Error(`Changelog not found at: ${changelogPath}`);
  }

  const changelogContent = fs.readFileSync(changelogPath, 'utf-8');

  // Load state
  const statePath = getStatePath(projectRoot);
  const state = loadState(statePath);

  // Detect differences
  const result = detectDiff(changelogContent, state);

  // Update last checked timestamp
  state.lastChecked = new Date().toISOString();
  saveState(statePath, state);

  return result;
}

/**
 * Mark entries as acknowledged and update state
 */
export function acknowledgeEntries(
  projectRoot: string,
  version: string,
  entryIds?: string[]
): void {
  const statePath = getStatePath(projectRoot);
  const state = loadState(statePath);

  state.lastAcknowledgedVersion = version;

  if (entryIds) {
    state.acknowledgedEntries = [
      ...new Set([...state.acknowledgedEntries, ...entryIds])
    ];
  }

  saveState(statePath, state);
}

/**
 * Mark an entry as skipped
 */
export function skipEntry(projectRoot: string, entryId: string): void {
  const statePath = getStatePath(projectRoot);
  const state = loadState(statePath);

  if (!state.skippedEntries.includes(entryId)) {
    state.skippedEntries.push(entryId);
  }

  saveState(statePath, state);
}

/**
 * Record that a config was applied
 */
export function recordAppliedConfig(projectRoot: string, configName: string): void {
  const statePath = getStatePath(projectRoot);
  const state = loadState(statePath);

  if (!state.appliedConfigs.includes(configName)) {
    state.appliedConfigs.push(configName);
  }

  saveState(statePath, state);
}

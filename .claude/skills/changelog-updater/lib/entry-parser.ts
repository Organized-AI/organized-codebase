/**
 * Entry Parser with Category Detection (feat-003)
 *
 * Parses changelog entries and classifies them by category
 * based on marker keywords from CHANGELOG-STANDARDS.md
 */

import type { ChangelogEntry } from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type EntryCategory =
  | 'config'
  | 'command'
  | 'tool'
  | 'architecture'
  | 'fix'
  | 'improvement'
  | 'breaking';

export type ActionType =
  | 'awareness'
  | 'config_update'
  | 'learn_command'
  | 'migrate';

export interface ExtractedDetails {
  envVars?: string[];
  commands?: string[];
  settings?: string[];
  flags?: string[];
  shortcuts?: string[];
}

export interface ParsedEntry {
  original: ChangelogEntry;
  category: EntryCategory;
  actionRequired: boolean;
  actionType: ActionType;
  extractedDetails: ExtractedDetails;
  confidence: number; // 0-1, how confident we are in the classification
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Markers (from CHANGELOG-STANDARDS.md)
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryDefinition {
  markers: RegExp[];
  actionType: ActionType;
  actionRequired: boolean;
}

const CATEGORY_DEFINITIONS: Record<EntryCategory, CategoryDefinition> = {
  config: {
    markers: [
      /env\s*var/i,
      /environment\s*variable/i,
      /settings\.json/i,
      /CLAUDE\.md/i,
      /\bconfigure\b/i,
      /\bflag\b/i,
      /`[A-Z_]+`.*(?:env|variable|setting)/i,
    ],
    actionType: 'config_update',
    actionRequired: true,
  },

  command: {
    markers: [
      /\/\w+/,                    // /command
      /Ctrl\+\w/i,               // Ctrl+X
      /Cmd\+\w/i,                // Cmd+X
      /--\w+/,                   // --flag
      /\bshortcut\b/i,
      /slash\s*command/i,
      /keyboard\s*shortcut/i,
    ],
    actionType: 'learn_command',
    actionRequired: true,
  },

  tool: {
    markers: [
      /\bMCP\b/,
      /mcp__/,
      /\bplugin\b/i,
      /\btool\b/i,
      /\bintegration\b/i,
      /\bChrome\b/,
      /\bVSCode\b/i,
      /\bVS\s*Code\b/i,
      /\bextension\b/i,
    ],
    actionType: 'awareness',
    actionRequired: false,
  },

  architecture: {
    markers: [
      /\bsystem\b/i,
      /\breplacing\b/i,
      /\bnew\s+\w+\s+system\b/i,
      /\barchitecture\b/i,
      /Task\s*system/i,
      /\bSDK\b/,
      /\bAPI\b/,
    ],
    actionType: 'awareness',
    actionRequired: true,
  },

  fix: {
    markers: [
      /\bFixed\b/,
      /\bfix\b/i,
      /\bbug\b/i,
      /\bissue\b/i,
      /\bcrash\b/i,
      /\berror\b/i,
      /\bregression\b/i,
    ],
    actionType: 'awareness',
    actionRequired: false,
  },

  improvement: {
    markers: [
      /\bImproved\b/,
      /\bimprovement\b/i,
      /\bperformance\b/i,
      /\breliability\b/i,
      /\bUX\b/,
      /\bfaster\b/i,
      /\bbetter\b/i,
      /\benhanced\b/i,
    ],
    actionType: 'awareness',
    actionRequired: false,
  },

  breaking: {
    markers: [
      /\bRemoved\b/,
      /\bChanged\b/,
      /\bbreaking\b/i,
      /no\s*longer\b/i,
      /\binstead\b/i,
      /\bdeprecated\b/i,
      /\bmigrat/i,
    ],
    actionType: 'migrate',
    actionRequired: true,
  },
};

// Priority order for when multiple categories match
const CATEGORY_PRIORITY: EntryCategory[] = [
  'breaking',      // Highest priority - user needs to know
  'architecture',
  'config',
  'command',
  'tool',
  'improvement',
  'fix',           // Lowest priority
];

// ─────────────────────────────────────────────────────────────────────────────
// Extraction Patterns
// ─────────────────────────────────────────────────────────────────────────────

const EXTRACTION_PATTERNS = {
  envVars: /`([A-Z][A-Z0-9_]+)`/g,
  commands: /`(\/\w+)`/g,
  settings: /`([\w.]+\.json)`/g,
  flags: /`(--[\w-]+)`/g,
  shortcuts: /(Ctrl|Cmd)\+(\w+)/gi,
};

// ─────────────────────────────────────────────────────────────────────────────
// Classification Logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate how many markers match for a given category
 */
function countMarkerMatches(content: string, markers: RegExp[]): number {
  let count = 0;
  for (const marker of markers) {
    if (marker.test(content)) {
      count++;
    }
  }
  return count;
}

/**
 * Determine the primary category for an entry
 */
function classifyEntry(entry: ChangelogEntry): { category: EntryCategory; confidence: number } {
  const content = entry.content;
  const section = entry.section?.toLowerCase() || '';

  // Quick wins based on section header
  if (section === 'fixed') {
    return { category: 'fix', confidence: 0.9 };
  }
  if (section === 'improved') {
    return { category: 'improvement', confidence: 0.9 };
  }
  if (section === 'removed' || section === 'changed') {
    return { category: 'breaking', confidence: 0.9 };
  }

  // Score each category
  const scores: { category: EntryCategory; score: number }[] = [];

  for (const category of CATEGORY_PRIORITY) {
    const def = CATEGORY_DEFINITIONS[category];
    const score = countMarkerMatches(content, def.markers);
    if (score > 0) {
      scores.push({ category, score });
    }
  }

  // No matches - default to improvement for "Added", fix otherwise
  if (scores.length === 0) {
    if (section === 'added') {
      return { category: 'improvement', confidence: 0.5 };
    }
    return { category: 'fix', confidence: 0.3 };
  }

  // Sort by score descending, then by priority
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return CATEGORY_PRIORITY.indexOf(a.category) - CATEGORY_PRIORITY.indexOf(b.category);
  });

  const best = scores[0];
  const confidence = Math.min(0.95, 0.5 + best.score * 0.15);

  return { category: best.category, confidence };
}

/**
 * Extract actionable details from entry content
 */
function extractDetails(content: string): ExtractedDetails {
  const details: ExtractedDetails = {};

  // Extract environment variables
  const envMatches = [...content.matchAll(EXTRACTION_PATTERNS.envVars)];
  if (envMatches.length > 0) {
    details.envVars = envMatches.map(m => m[1]);
  }

  // Extract slash commands
  const cmdMatches = [...content.matchAll(EXTRACTION_PATTERNS.commands)];
  if (cmdMatches.length > 0) {
    details.commands = cmdMatches.map(m => m[1]);
  }

  // Extract settings files
  const settingsMatches = [...content.matchAll(EXTRACTION_PATTERNS.settings)];
  if (settingsMatches.length > 0) {
    details.settings = settingsMatches.map(m => m[1]);
  }

  // Extract CLI flags
  const flagMatches = [...content.matchAll(EXTRACTION_PATTERNS.flags)];
  if (flagMatches.length > 0) {
    details.flags = flagMatches.map(m => m[1]);
  }

  // Extract keyboard shortcuts
  const shortcutMatches = [...content.matchAll(EXTRACTION_PATTERNS.shortcuts)];
  if (shortcutMatches.length > 0) {
    details.shortcuts = shortcutMatches.map(m => `${m[1]}+${m[2]}`);
  }

  return details;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a single changelog entry
 */
export function parseEntry(entry: ChangelogEntry): ParsedEntry {
  const { category, confidence } = classifyEntry(entry);
  const def = CATEGORY_DEFINITIONS[category];

  return {
    original: entry,
    category,
    actionRequired: def.actionRequired,
    actionType: def.actionType,
    extractedDetails: extractDetails(entry.content),
    confidence,
  };
}

/**
 * Parse multiple changelog entries
 */
export function parseEntries(entries: ChangelogEntry[]): ParsedEntry[] {
  return entries.map(parseEntry);
}

/**
 * Group parsed entries by category
 */
export function groupByCategory(entries: ParsedEntry[]): Map<EntryCategory, ParsedEntry[]> {
  const groups = new Map<EntryCategory, ParsedEntry[]>();

  for (const entry of entries) {
    const existing = groups.get(entry.category) || [];
    existing.push(entry);
    groups.set(entry.category, existing);
  }

  return groups;
}

/**
 * Group parsed entries by action type
 */
export function groupByActionType(entries: ParsedEntry[]): Map<ActionType, ParsedEntry[]> {
  const groups = new Map<ActionType, ParsedEntry[]>();

  for (const entry of entries) {
    const existing = groups.get(entry.actionType) || [];
    existing.push(entry);
    groups.set(entry.actionType, existing);
  }

  return groups;
}

/**
 * Filter entries that require user action
 */
export function getActionableEntries(entries: ParsedEntry[]): ParsedEntry[] {
  return entries.filter(e => e.actionRequired);
}

/**
 * Get summary statistics for a set of parsed entries
 */
export function getSummaryStats(entries: ParsedEntry[]): {
  total: number;
  byCategory: Record<EntryCategory, number>;
  byActionType: Record<ActionType, number>;
  actionRequired: number;
} {
  const stats = {
    total: entries.length,
    byCategory: {} as Record<EntryCategory, number>,
    byActionType: {} as Record<ActionType, number>,
    actionRequired: 0,
  };

  for (const entry of entries) {
    stats.byCategory[entry.category] = (stats.byCategory[entry.category] || 0) + 1;
    stats.byActionType[entry.actionType] = (stats.byActionType[entry.actionType] || 0) + 1;
    if (entry.actionRequired) stats.actionRequired++;
  }

  return stats;
}

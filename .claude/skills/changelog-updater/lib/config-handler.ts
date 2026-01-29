/**
 * Config Update Handler (feat-006)
 *
 * Executes settings.json and environment variable updates
 * when user approves config-type changelog entries.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { ParsedEntry } from './entry-parser';
import type { ActionHandler, ActionResult } from './action-router';
import type { UserAction } from './presentation';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfigUpdate {
  type: 'env_var' | 'settings_json' | 'claude_md';
  key: string;
  value?: string;
  description: string;
  suggestedValue?: string;
}

export interface ShellProfile {
  path: string;
  name: string;
  exists: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shell Profile Detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect available shell profiles
 */
export function detectShellProfiles(): ShellProfile[] {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const profiles: ShellProfile[] = [];

  const shellFiles = [
    { name: '.zshrc', path: path.join(home, '.zshrc') },
    { name: '.bashrc', path: path.join(home, '.bashrc') },
    { name: '.bash_profile', path: path.join(home, '.bash_profile') },
    { name: '.profile', path: path.join(home, '.profile') },
  ];

  for (const file of shellFiles) {
    profiles.push({
      name: file.name,
      path: file.path,
      exists: fs.existsSync(file.path),
    });
  }

  return profiles;
}

/**
 * Get the primary shell profile to use
 */
export function getPrimaryShellProfile(): ShellProfile | null {
  const profiles = detectShellProfiles();
  return profiles.find(p => p.exists) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Config Extraction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract config updates from a parsed entry
 */
export function extractConfigUpdates(entry: ParsedEntry): ConfigUpdate[] {
  const updates: ConfigUpdate[] = [];
  const details = entry.extractedDetails;
  const content = entry.original.content;

  // Environment variables
  if (details.envVars) {
    for (const envVar of details.envVars) {
      updates.push({
        type: 'env_var',
        key: envVar,
        description: `Environment variable from: ${content.substring(0, 80)}...`,
        suggestedValue: guessSuggestedValue(envVar, content),
      });
    }
  }

  // Settings.json references
  if (details.settings) {
    for (const setting of details.settings) {
      if (setting === 'settings.json') {
        updates.push({
          type: 'settings_json',
          key: extractSettingKey(content),
          description: `Settings update from: ${content.substring(0, 80)}...`,
        });
      }
    }
  }

  // CLAUDE.md references
  if (content.toLowerCase().includes('claude.md')) {
    updates.push({
      type: 'claude_md',
      key: 'CLAUDE.md',
      description: `CLAUDE.md update: ${content.substring(0, 80)}...`,
    });
  }

  return updates;
}

/**
 * Guess a suggested value for an env var based on context
 */
function guessSuggestedValue(envVar: string, content: string): string | undefined {
  // Common patterns
  if (envVar.includes('ENABLE') || envVar.includes('DISABLE')) {
    return 'true';
  }
  if (envVar.includes('MAX') || envVar.includes('LIMIT')) {
    // Look for numbers in content
    const numMatch = content.match(/(\d{3,})/);
    if (numMatch) return numMatch[1];
    return '10000';
  }
  if (envVar.includes('PATH') || envVar.includes('DIR')) {
    return './';
  }
  return undefined;
}

/**
 * Extract setting key from content
 */
function extractSettingKey(content: string): string {
  // Try to find a quoted key
  const keyMatch = content.match(/"([a-zA-Z_.]+)"/);
  if (keyMatch) return keyMatch[1];

  // Try to find a backticked key
  const btMatch = content.match(/`([a-zA-Z_.]+)`/);
  if (btMatch) return btMatch[1];

  return 'unknown';
}

// ─────────────────────────────────────────────────────────────────────────────
// Config Application
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate shell export line for an env var
 */
export function generateExportLine(envVar: string, value: string): string {
  return `export ${envVar}="${value}"`;
}

/**
 * Check if env var is already set in a shell profile
 */
export function isEnvVarInProfile(profilePath: string, envVar: string): boolean {
  try {
    const content = fs.readFileSync(profilePath, 'utf-8');
    const pattern = new RegExp(`^\\s*export\\s+${envVar}=`, 'm');
    return pattern.test(content);
  } catch {
    return false;
  }
}

/**
 * Add env var to shell profile
 */
export function addEnvVarToProfile(
  profilePath: string,
  envVar: string,
  value: string,
  dryRun: boolean = false
): ActionResult {
  const exportLine = generateExportLine(envVar, value);

  if (isEnvVarInProfile(profilePath, envVar)) {
    return {
      success: true,
      message: `${envVar} already exists in ${path.basename(profilePath)}`,
      details: { alreadyExists: true },
    };
  }

  if (dryRun) {
    return {
      success: true,
      message: `[DRY RUN] Would add to ${path.basename(profilePath)}: ${exportLine}`,
      details: { dryRun: true, line: exportLine },
    };
  }

  try {
    const content = fs.readFileSync(profilePath, 'utf-8');
    const newContent = content.trimEnd() + '\n\n# Added by changelog-updater\n' + exportLine + '\n';
    fs.writeFileSync(profilePath, newContent);

    return {
      success: true,
      message: `Added ${envVar} to ${path.basename(profilePath)}`,
      details: { line: exportLine },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update ${profilePath}: ${error}`,
      recoverable: true,
    };
  }
}

/**
 * Update settings.json with a new setting
 */
export function updateSettingsJson(
  projectRoot: string,
  key: string,
  value: unknown,
  dryRun: boolean = false
): ActionResult {
  const settingsPath = path.join(projectRoot, '.claude', 'settings.json');

  if (dryRun) {
    return {
      success: true,
      message: `[DRY RUN] Would update ${key} in settings.json`,
      details: { dryRun: true, key, value },
    };
  }

  try {
    let settings: Record<string, unknown> = {};

    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      settings = JSON.parse(content);
    } else {
      // Ensure directory exists
      const dir = path.dirname(settingsPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Set nested key (supports dot notation)
    const keys = key.split('.');
    let current: Record<string, unknown> = settings;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    return {
      success: true,
      message: `Updated ${key} in settings.json`,
      details: { key, value },
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to update settings.json: ${error}`,
      recoverable: true,
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Handler Implementation
// ─────────────────────────────────────────────────────────────────────────────

export interface ConfigHandlerOptions {
  projectRoot: string;
  dryRun: boolean;
  preferredProfile?: string;
}

/**
 * Create the config update handler
 */
export function createConfigHandler(options: ConfigHandlerOptions): ActionHandler {
  return {
    canHandle(entry: ParsedEntry, action: UserAction): boolean {
      return entry.category === 'config' && action === 'apply';
    },

    async execute(entry: ParsedEntry, _action: UserAction): Promise<ActionResult> {
      const updates = extractConfigUpdates(entry);

      if (updates.length === 0) {
        return {
          success: true,
          message: 'No config updates found in entry',
        };
      }

      const results: ActionResult[] = [];

      for (const update of updates) {
        if (update.type === 'env_var') {
          const profile = options.preferredProfile
            ? { path: options.preferredProfile, name: path.basename(options.preferredProfile), exists: true }
            : getPrimaryShellProfile();

          if (!profile) {
            results.push({
              success: false,
              error: 'No shell profile found',
              recoverable: true,
            });
            continue;
          }

          const value = update.suggestedValue ?? 'true';
          results.push(
            addEnvVarToProfile(profile.path, update.key, value, options.dryRun)
          );
        } else if (update.type === 'settings_json') {
          results.push(
            updateSettingsJson(options.projectRoot, update.key, true, options.dryRun)
          );
        }
      }

      const allSuccess = results.every(r => r.success);
      const messages = results.map(r =>
        r.success ? (r as { message: string }).message : (r as { error: string }).error
      );

      if (allSuccess) {
        return {
          success: true,
          message: messages.join('; '),
          details: { updates: updates.length },
        };
      } else {
        return {
          success: false,
          error: messages.join('; '),
          recoverable: true,
        };
      }
    },

    describe(): string {
      return 'Config Update Handler - applies env vars and settings.json updates';
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get a preview of what changes would be made
 */
export function previewConfigChanges(entry: ParsedEntry): string[] {
  const updates = extractConfigUpdates(entry);
  const previews: string[] = [];

  for (const update of updates) {
    if (update.type === 'env_var') {
      const value = update.suggestedValue ?? '[value]';
      previews.push(`Add to shell profile: export ${update.key}="${value}"`);
    } else if (update.type === 'settings_json') {
      previews.push(`Update settings.json: ${update.key}`);
    } else if (update.type === 'claude_md') {
      previews.push(`Review CLAUDE.md for updates`);
    }
  }

  return previews;
}

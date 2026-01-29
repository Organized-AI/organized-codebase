/**
 * Tests for Config Handler
 *
 * Run with: npx tsx config-handler.test.ts
 */

import {
  detectShellProfiles,
  extractConfigUpdates,
  generateExportLine,
  createConfigHandler,
  previewConfigChanges,
} from './config-handler';
import { parseEntries } from './entry-parser';
import type { ChangelogEntry } from './diff-detector';

// ─────────────────────────────────────────────────────────────────────────────
// Test Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.1.22',
    section: 'Added',
    content: '`CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS` environment variable to override the default file read token limit',
    rawLine: '- env var...',
  },
  {
    version: '2.1.19',
    section: 'Added',
    content: 'Set env var `CLAUDE_CODE_ENABLE_TASKS=false` to temporarily use the legacy TodoWrite system',
    rawLine: '- task system...',
  },
  {
    version: '2.1.20',
    section: 'Added',
    content: 'Support for loading `CLAUDE.md` files from additional directories',
    rawLine: '- claude.md...',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Test Utilities
// ─────────────────────────────────────────────────────────────────────────────

function test(name: string, fn: () => void | Promise<void>): void {
  Promise.resolve(fn())
    .then(() => console.log(`✓ ${name}`))
    .catch(error => {
      console.error(`✗ ${name}`);
      console.error(`  ${error}`);
      process.exitCode = 1;
    });
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

function assertTrue(condition: boolean, msg: string): void {
  if (!condition) {
    throw new Error(msg);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────────────────────────────

console.log('\n📋 Config Handler Tests\n');

test('detectShellProfiles returns profile list', () => {
  const profiles = detectShellProfiles();

  assertTrue(profiles.length > 0, 'Should detect shell profiles');
  assertTrue(
    profiles.every(p => p.name && p.path),
    'All profiles should have name and path'
  );
});

test('extractConfigUpdates finds env vars', () => {
  const parsed = parseEntries(CONFIG_ENTRIES);
  const configEntry = parsed[0];
  const updates = extractConfigUpdates(configEntry);

  assertTrue(updates.length > 0, 'Should find updates');
  assertEqual(updates[0].type, 'env_var');
  assertEqual(updates[0].key, 'CLAUDE_CODE_FILE_READ_MAX_OUTPUT_TOKENS');
});

test('extractConfigUpdates suggests values for limit vars', () => {
  const parsed = parseEntries(CONFIG_ENTRIES);
  const configEntry = parsed[0];
  const updates = extractConfigUpdates(configEntry);

  assertTrue(
    updates[0].suggestedValue !== undefined,
    'Should suggest value for MAX/LIMIT vars'
  );
});

test('extractConfigUpdates finds CLAUDE.md references', () => {
  const parsed = parseEntries(CONFIG_ENTRIES);
  const claudeMdEntry = parsed[2];
  const updates = extractConfigUpdates(claudeMdEntry);

  const claudeMdUpdate = updates.find(u => u.type === 'claude_md');
  assertTrue(claudeMdUpdate !== undefined, 'Should find CLAUDE.md update');
});

test('generateExportLine formats correctly', () => {
  const line = generateExportLine('MY_VAR', 'my_value');
  assertEqual(line, 'export MY_VAR="my_value"');
});

test('createConfigHandler handles config entries', () => {
  const handler = createConfigHandler({
    projectRoot: '/test',
    dryRun: true,
  });

  const parsed = parseEntries(CONFIG_ENTRIES);
  const configEntry = parsed[0];

  assertTrue(
    handler.canHandle(configEntry, 'apply'),
    'Should handle config + apply'
  );
  assertTrue(
    !handler.canHandle(configEntry, 'skip'),
    'Should not handle config + skip'
  );
});

test('createConfigHandler executes in dry run mode', async () => {
  const handler = createConfigHandler({
    projectRoot: '/test',
    dryRun: true,
  });

  const parsed = parseEntries(CONFIG_ENTRIES);
  const configEntry = parsed[0];

  const result = await handler.execute(configEntry, 'apply');

  assertTrue(result.success, 'Dry run should succeed');
  assertTrue(
    (result as { message: string }).message.includes('DRY RUN'),
    'Should indicate dry run'
  );
});

test('previewConfigChanges returns previews', () => {
  const parsed = parseEntries(CONFIG_ENTRIES);
  const configEntry = parsed[0];
  const previews = previewConfigChanges(configEntry);

  assertTrue(previews.length > 0, 'Should have previews');
  assertTrue(
    previews[0].includes('export'),
    'Should show export command'
  );
});

test('handler describe returns description', () => {
  const handler = createConfigHandler({
    projectRoot: '/test',
    dryRun: true,
  });

  const desc = handler.describe();
  assertTrue(desc.length > 0, 'Should have description');
  assertTrue(desc.includes('Config'), 'Should mention config');
});

setTimeout(() => {
  console.log('\n✅ All tests completed!\n');
}, 100);

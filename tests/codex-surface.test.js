const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const requiredFiles = [
  'AGENTS.md',
  '.codex/config.toml',
  '.codex/agents/explorer.toml',
  '.codex/agents/reviewer.toml',
  '.codex/agents/docs-researcher.toml',
  'DOCUMENTATION/CODEX-SETUP.md',
  'DOCUMENTATION/CODEX-VS-CLAUDE-SURFACE-MAP.md'
];

requiredFiles.forEach((file) => {
  const full = path.join(root, file);
  assert.ok(fs.existsSync(full), `missing ${file}`);
  assert.ok(fs.readFileSync(full, 'utf8').length > 0, `${file} is empty`);
});

console.log('codex-surface.test.js passed');

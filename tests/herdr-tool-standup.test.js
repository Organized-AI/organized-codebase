const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const docPath = path.join(root, 'DOCUMENTATION', 'HERDR-TOOL-STANDUP.md');
const justfilePath = path.join(root, 'templates', 'justfile');

assert.ok(fs.existsSync(docPath), 'missing DOCUMENTATION/HERDR-TOOL-STANDUP.md');
const doc = fs.readFileSync(docPath, 'utf8');
assert.ok(doc.includes('Organized-AI/plugin-marketplace'), 'doc should mention Organized AI plugin marketplace');
assert.ok(doc.includes('hermes tools enable terminal'), 'doc should mention Hermes tool standing-up');
assert.ok(doc.includes('.codex/config.toml'), 'doc should mention Codex adapter surface');
assert.ok(doc.includes('Herdr'), 'doc should mention Herdr');

assert.ok(fs.existsSync(justfilePath), 'missing templates/justfile');
const justfile = fs.readFileSync(justfilePath, 'utf8');
assert.ok(justfile.includes('add-herdr-tool-standup'), 'justfile should expose add-herdr-tool-standup');

console.log('herdr-tool-standup.test.js passed');

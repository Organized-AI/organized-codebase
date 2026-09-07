const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-pi-harness-'));
const sandboxRoot = path.join(tmpDir, 'repo');
fs.mkdirSync(path.join(sandboxRoot, 'harnesses', 'pi-agent'), { recursive: true });
fs.copyFileSync(
  path.join(repoRoot, 'harnesses', 'pi-agent', 'frontier-pairings.json'),
  path.join(sandboxRoot, 'harnesses', 'pi-agent', 'frontier-pairings.json')
);
fs.mkdirSync(path.join(sandboxRoot, 'scripts'), { recursive: true });
fs.copyFileSync(
  path.join(repoRoot, 'scripts', 'scaffold-pi-harness.js'),
  path.join(sandboxRoot, 'scripts', 'scaffold-pi-harness.js')
);

execFileSync(
  'node',
  [
    path.join(sandboxRoot, 'scripts', 'scaffold-pi-harness.js'),
    '--name', 'Claude Qwen Research',
    '--frontier', 'claude-sonnet-4',
    '--local', 'qwen3:8b'
  ],
  { cwd: sandboxRoot, stdio: 'pipe' }
);

const harnessDir = path.join(sandboxRoot, 'harnesses', 'claude-qwen-research');
assert.ok(fs.existsSync(path.join(harnessDir, 'harness.json')));
assert.ok(fs.existsSync(path.join(harnessDir, 'agents', 'orchestrator.md')));
assert.ok(fs.existsSync(path.join(harnessDir, 'tasks', 'task_packet.template.json')));

const manifest = JSON.parse(fs.readFileSync(path.join(harnessDir, 'harness.json'), 'utf8'));
assert.strictEqual(manifest.frontierModel, 'claude-sonnet-4');
assert.strictEqual(manifest.localModel, 'qwen3:8b');

console.log('pi-harness-scaffold.test.js passed');

#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const result = {};
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
    } else {
      result[key] = next;
      i += 1;
    }
  }
  return result;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(target, content) {
  ensureDir(path.dirname(target));
  fs.writeFileSync(target, content);
}

function loadPairings(rootDir) {
  const pairingsPath = path.join(rootDir, 'harnesses', 'pi-agent', 'frontier-pairings.json');
  if (!fs.existsSync(pairingsPath)) {
    return { version: '1', pairings: [] };
  }
  return JSON.parse(fs.readFileSync(pairingsPath, 'utf8'));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'pi-harness';
}

const args = parseArgs(process.argv);
if (args.help || !args.name || !args.frontier || !args.local) {
  console.log('Usage:\n  node scripts/scaffold-pi-harness.js --name <harness-name> --frontier <frontier-model> --local <local-model> [--task-class plan] [--privacy local-only]');
  process.exit(args.help ? 0 : 1);
}

const repoRoot = process.cwd();
const harnessRoot = path.join(repoRoot, 'harnesses');
const harnessName = slugify(args.name);
const target = path.join(harnessRoot, harnessName);
const pairings = loadPairings(repoRoot);
const preset = pairings.pairings.find((pairing) => pairing.frontier === args.frontier && pairing.local === args.local) || null;

if (fs.existsSync(target)) {
  console.error(`Harness already exists: ${target}`);
  process.exit(1);
}

ensureDir(target);
ensureDir(path.join(target, 'agents'));
ensureDir(path.join(target, 'tasks'));
ensureDir(path.join(target, 'runs'));
ensureDir(path.join(target, 'logs'));
ensureDir(path.join(target, 'eval'));

const manifest = {
  version: '1',
  name: harnessName,
  createdAt: new Date().toISOString(),
  frontierModel: args.frontier,
  localModel: args.local,
  taskClass: args['task-class'] || 'research',
  privacy: args.privacy || 'local-only',
  objective: 'Mimic frontier task shape, verifier posture, and escalation policy with a cheaper local worker.',
  mimicContract: preset ? preset.mimic_contract : [
    'bounded JSON output',
    'deterministic verification before promotion',
    'escalate when ambiguity or risk exceeds local route budget'
  ]
};

const modelRoutes = {
  default: {
    local: args.local,
    frontier: args.frontier,
    escalateWhen: [
      'task becomes high-stakes',
      'verifier fails twice',
      'local worker confidence is low',
      'user requests final frontier pass'
    ]
  }
};

const permissions = {
  allow: ['read files', 'write sibling harness files', 'run local deterministic verifiers'],
  deny: ['network writes without approval', 'secret exfiltration', 'unbounded shell execution']
};

const sandboxPolicy = {
  filesystem: {
    writable: ['tasks/', 'runs/', 'logs/', 'eval/'],
    readOnly: ['../pi-agent/', '../../CONFIG/router/']
  },
  shell: {
    allowed: ['python3 -m json.tool', 'node --check', 'pytest -q'],
    blocked: ['rm -rf /', 'git push --force']
  }
};

const taskPacket = {
  task_id: 'example-task',
  frontier_parent: args.frontier,
  local_worker: args.local,
  task_class: args['task-class'] || 'research',
  acceptance: [
    'return bounded JSON only',
    'cite files or evidence',
    'state escalation reason if frontier review is required'
  ]
};

const evalRubric = {
  taskPackAgreement: 'Measure structural agreement with the frontier parent on representative tasks.',
  legalActionRate: 'Did the harness stay inside its allowed action set?',
  verifierPassRate: 'Did deterministic verification pass before promotion?',
  escalationPrecision: 'Did the harness escalate only when needed?',
  costPerSuccessfulTask: 'Track local-first efficiency against the frontier baseline.'
};

writeFile(path.join(target, 'harness.json'), JSON.stringify(manifest, null, 2) + '\n');
writeFile(path.join(target, 'model_routes.json'), JSON.stringify(modelRoutes, null, 2) + '\n');
writeFile(path.join(target, 'permissions.json'), JSON.stringify(permissions, null, 2) + '\n');
writeFile(path.join(target, 'sandbox_policy.json'), JSON.stringify(sandboxPolicy, null, 2) + '\n');
writeFile(path.join(target, 'tasks', 'task_packet.template.json'), JSON.stringify(taskPacket, null, 2) + '\n');
writeFile(path.join(target, 'eval', 'rubric.json'), JSON.stringify(evalRubric, null, 2) + '\n');
writeFile(path.join(target, 'runs', '.gitkeep'), '');
writeFile(path.join(target, 'logs', '.gitkeep'), '');

writeFile(path.join(target, 'agents', 'orchestrator.md'), `# ${harnessName} orchestrator\n\nTurn the user goal into compact task packets that preserve the **frontier parent's** task shape. Route to the local worker first. Escalate only when the verifier or risk policy says the task exceeded the local route budget.\n`);
writeFile(path.join(target, 'agents', 'worker.md'), `# ${harnessName} worker\n\nLocal ${args.local} worker. Emit bounded JSON, cite evidence, and keep side effects inside the harness contract. Mimic ${args.frontier}'s decision structure, not its prose.\n`);
writeFile(path.join(target, 'agents', 'verifier.md'), `# ${harnessName} verifier\n\nReject outputs that violate the JSON contract, omit evidence, exceed permissions, or skip escalation when uncertainty is high. Promotion requires deterministic proof plus route-specific sanity checks.\n`);
writeFile(path.join(target, 'README.md'), `# ${harnessName}\n\nFrontier parent: ${args.frontier}\nLocal worker: ${args.local}\n\n## Purpose\nThis sibling harness is for narrow tasks where the local worker can imitate the frontier parent's **operating shape** cheaply enough to be useful.\n\n## First steps\n1. Edit \`tasks/task_packet.template.json\`\n2. Run a representative task pack\n3. Compare against the frontier parent using \`eval/rubric.json\`\n4. Promote only rules that generalize\n`);

console.log(target);

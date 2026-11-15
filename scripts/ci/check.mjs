#!/usr/bin/env node
// Repository checks that need no network, no API key and no account. CI runs this on every pull
// request (ci.yml, "Structure" step); run it locally with `npm run check`. Exit 1 on any problem.
//
//   1. Every tracked JSON file parses (templates with {{PLACEHOLDER}} tokens are skipped).
//   2. Every tracked YAML file parses (all documents in the file).
//   3. Every skill (.claude/skills/<dir>/SKILL.md) has YAML frontmatter with a string `name` and
//      `description`, and `name` matches its directory.
//   4. Every agent and command (.claude/agents/*.md, .claude/commands/*.md) with frontmatter parses;
//      agents also need `name` and `description`.
//   5. Every tracked shell script passes `bash -n`.
//   6. The example Helix plan passes `helix-check validate`.

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { basename, dirname } from 'node:path';
import { parse, parseAllDocuments } from 'yaml';

const problems = [];
const fail = (file, msg) => problems.push(`${file}: ${msg}`);

const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const matching = (re) => tracked.filter((f) => re.test(f));

function frontmatter(file) {
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return null;
  return parse(m[1]);
}

// 1. JSON. A file with {{PLACEHOLDER}} tokens is a template filled in by a generator, not JSON yet,
//    so it is skipped (and listed in the summary) rather than failed.
const templates = [];
for (const f of matching(/\.json$/)) {
  const text = readFileSync(f, 'utf8');
  try { JSON.parse(text); } catch (e) {
    if (/\{\{[A-Z0-9_]+\}\}/.test(text)) { templates.push(f); continue; }
    fail(f, `invalid JSON: ${e.message}`);
  }
}

// 2. YAML
for (const f of matching(/\.ya?ml$/)) {
  const docs = parseAllDocuments(readFileSync(f, 'utf8'));
  for (const d of docs) if (d.errors.length) fail(f, `invalid YAML: ${d.errors[0].message.split('\n')[0]}`);
}

// 3. Skills
for (const f of matching(/^\.claude\/skills\/[^/]+\/SKILL\.md$/)) {
  let fm;
  try { fm = frontmatter(f); } catch (e) { fail(f, `frontmatter is not valid YAML: ${e.message.split('\n')[0]}`); continue; }
  if (!fm) { fail(f, 'missing YAML frontmatter'); continue; }
  if (typeof fm.name !== 'string' || !fm.name) fail(f, 'frontmatter needs a string `name`');
  if (typeof fm.description !== 'string' || !fm.description) fail(f, 'frontmatter needs a string `description`');
  const dir = basename(dirname(f));
  if (fm.name && fm.name !== dir) fail(f, `name "${fm.name}" does not match its directory "${dir}"`);
}

// 4. Agents and commands
for (const f of matching(/^\.claude\/(agents|commands)\/[^/]+\.md$/)) {
  let fm;
  try { fm = frontmatter(f); } catch (e) { fail(f, `frontmatter is not valid YAML: ${e.message.split('\n')[0]}`); continue; }
  if (f.startsWith('.claude/agents/')) {
    if (!fm) { fail(f, 'agent needs YAML frontmatter'); continue; }
    if (typeof fm.name !== 'string' || !fm.name) fail(f, 'agent frontmatter needs a string `name`');
    if (typeof fm.description !== 'string' || !fm.description) fail(f, 'agent frontmatter needs a string `description`');
  }
}

// 5. Shell scripts
for (const f of matching(/\.sh$/)) {
  try { execFileSync('bash', ['-n', f], { stdio: 'pipe' }); } catch (e) { fail(f, `bash -n: ${String(e.stderr).trim().split('\n')[0]}`); }
}

// 6. Helix example plan
try {
  execFileSync(process.execPath, ['scripts/helix/helix-check.js', 'validate', '--plan', 'PLANNING/helix/checkpoints.example.json'], { stdio: 'pipe' });
} catch (e) {
  fail('PLANNING/helix/checkpoints.example.json', `helix-check validate: ${String(e.stderr).trim()}`);
}

const counted = {
  json: matching(/\.json$/).length,
  yaml: matching(/\.ya?ml$/).length,
  skills: matching(/^\.claude\/skills\/[^/]+\/SKILL\.md$/).length,
  agentsAndCommands: matching(/^\.claude\/(agents|commands)\/[^/]+\.md$/).length,
  shell: matching(/\.sh$/).length,
};

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(`✓ checked ${counted.json - templates.length} JSON (${templates.length} placeholder templates skipped), ${counted.yaml} YAML, ${counted.skills} skills, ` +
  `${counted.agentsAndCommands} agents/commands, ${counted.shell} shell scripts, 1 Helix plan`);

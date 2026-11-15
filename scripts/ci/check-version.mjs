#!/usr/bin/env node
// Version and changelog agree. Modeled on podcast-agent's tools/ci/check_version.py.
//
//   node scripts/ci/check-version.mjs                 CHANGELOG.md has [Unreleased] and a section for
//                                                     package.json's version (every pull request)
//   node scripts/ci/check-version.mjs --tag v1.2.3    also: the tag is v + package.json's version
//                                                     (release.yml, before anything is published)
//   node scripts/ci/check-version.mjs --notes v1.2.3  print that version's CHANGELOG section (release notes)

import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

const version = JSON.parse(readFileSync('package.json', 'utf8')).version;
const changelog = readFileSync('CHANGELOG.md', 'utf8');

// Sections are "## [X.Y.Z]" or "## [X.Y.Z] - YYYY-MM-DD", plus "## [Unreleased]".
const sections = new Map();
const re = /^## \[([^\]]+)\][^\n]*\n([\s\S]*?)(?=^## \[|(?![\s\S]))/gm;
for (const m of changelog.matchAll(re)) sections.set(m[1], m[2].trim());

const notesFor = flag('--notes');
if (notesFor) {
  const v = notesFor.replace(/^v/, '');
  if (!sections.has(v)) { console.error(`CHANGELOG.md has no "## [${v}]" section`); process.exit(1); }
  process.stdout.write(sections.get(v) + '\n');
  process.exit(0);
}

const problems = [];
if (!/^\d+\.\d+\.\d+$/.test(version)) problems.push(`package.json version "${version}" is not X.Y.Z`);
if (!sections.has('Unreleased')) problems.push('CHANGELOG.md needs a "## [Unreleased]" section');
if (!sections.has(version)) problems.push(`CHANGELOG.md has no "## [${version}]" section for package.json's version`);

const tag = flag('--tag');
if (tag && tag !== `v${version}`) problems.push(`tag ${tag} does not match package.json version v${version}`);

if (problems.length) {
  problems.forEach((p) => console.error(`✗ ${p}`));
  process.exit(1);
}
console.log(`✓ version ${version}${tag ? `, tag ${tag}` : ''} and CHANGELOG.md agree`);

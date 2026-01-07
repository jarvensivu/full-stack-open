#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { findPackageJsons, parseJsonOutput } = require('./utils');

function usage() {
  console.log('Usage: node scripts/check-outdated.js [--json] [--root=<path>]');
  process.exit(1);
}

const argv = process.argv.slice(2);
let outJson = false;
let root = process.cwd();
for (const a of argv) {
  if (a === '--json') outJson = true;
  else if (a.startsWith('--root=')) root = path.resolve(a.split('=')[1]);
  else usage();
}

const pkgs = findPackageJsons(root);
const results = [];

for (const pj of pkgs) {
  const dir = path.dirname(pj);
  // run npm outdated --json --depth=0 in each project dir
  const cmd = 'npm';
  const args = ['outdated', '--json', '--depth=0'];
  const res = spawnSync(cmd, args, { cwd: dir, encoding: 'utf8' });
  const stdout = (res.stdout || '').trim();
  const stderr = (res.stderr || '').trim();
  let parsed = parseJsonOutput(stdout, stderr);

  if (!parsed) {
    // no outdated packages
    results.push({ project: dir, outdated: null });
  } else {
    // parsed is an object keyed by package name
    const items = Object.keys(parsed).map(name => {
      const info = parsed[name];
      return { name, current: info.current, wanted: info.wanted, latest: info.latest };
    });
    results.push({ project: dir, outdated: items });
  }
}

const projectsWithOutdated = results.filter(r => r.outdated && r.outdated.length > 0);

if (outJson) {
  console.log(JSON.stringify({ checked: results.length, outdatedCount: projectsWithOutdated.length, results }, null, 2));
  process.exit(0);
}

console.log(`Checked ${results.length} project(s). ${projectsWithOutdated.length} project(s) have outdated deps.`);
for (const p of projectsWithOutdated) {
  console.log('\n==> ' + p.project);
  for (const dep of p.outdated) {
    console.log(`  - ${dep.name}: current=${dep.current} wanted=${dep.wanted} latest=${dep.latest}`);
  }
}

if (projectsWithOutdated.length === 0) console.log('\nAll dependencies are up to date (as reported by npm outdated).');

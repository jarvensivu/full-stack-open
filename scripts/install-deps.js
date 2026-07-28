#!/usr/bin/env node
const path = require('path');
const { spawnSync } = require('child_process');
const { findPackageJsons } = require('./utils');

function usage() {
  console.log('Usage: node scripts/install-deps.js [--root=<path>] [--ci] [--json]');
  process.exit(1);
}

const argv = process.argv.slice(2);
let root = process.cwd();
let ci = false;
let outJson = false;

for (const a of argv) {
  if (a === '--ci') ci = true;
  else if (a === '--json') outJson = true;
  else if (a.startsWith('--root=')) root = path.resolve(a.split('=')[1]);
  else usage();
}

const pkgFiles = findPackageJsons(root);
const summary = [];

for (const pj of pkgFiles) {
  const dir = path.dirname(pj);
  const cmd = 'npm';
  const args = ci ? ['ci'] : ['install'];

  if (!outJson) {
    console.log(`\n==> Installing deps in ${dir}`);
    console.log('Command:', cmd, args.join(' '));
  }

  const res = spawnSync(cmd, args, {
    cwd: dir,
    stdio: outJson ? 'pipe' : 'inherit',
    encoding: 'utf8',
  });

  const success = res.status === 0;
  summary.push({ project: dir, command: `${cmd} ${args.join(' ')}`, success, status: res.status });
}

const failed = summary.filter(s => !s.success);

if (outJson) {
  console.log(JSON.stringify({ installed: summary.length, failures: failed.length, summary }, null, 2));
  process.exit(failed.length === 0 ? 0 : 2);
}

console.log(`\nInstalled deps in ${summary.length} project(s). ${failed.length} failed.`);
for (const f of failed) console.log(` - Failed: ${f.project} (status=${f.status})`);

if (failed.length > 0) process.exit(2);

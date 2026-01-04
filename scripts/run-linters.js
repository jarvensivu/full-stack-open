#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function usage() {
  console.log('Usage: node scripts/run-linters.js [--root=<path>] [--fix] [--json]');
  process.exit(1);
}

const argv = process.argv.slice(2);
let root = process.cwd();
let fix = false;
let outJson = false;
for (const a of argv) {
  if (a === '--fix') fix = true;
  else if (a === '--json') outJson = true;
  else if (a.startsWith('--root=')) root = path.resolve(a.split('=')[1]);
  else usage();
}

function findPackageJsons(dir) {
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return results; }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'dist' || e.name === 'coverage' || e.name === 'public') continue;
    const full = path.join(dir, e.name);
    if (e.isFile() && e.name === 'package.json') results.push(full);
    else if (e.isDirectory() && !e.isSymbolicLink()) results.push(...findPackageJsons(full));
  }
  return results;
}

function hasEslintDependency(pkg) {
  const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
  if (deps['eslint'] || deps['@eslint/js']) return true;
  return false;
}

const pkgFiles = findPackageJsons(root);
const summary = [];

for (const pj of pkgFiles) {
  let pkg;
  try { pkg = JSON.parse(fs.readFileSync(pj, 'utf8')); }
  catch (e) { continue; }
  const dir = path.dirname(pj);
  const hasLintScript = pkg.scripts && pkg.scripts.lint;
  const hasEslint = hasEslintDependency(pkg);
  if (!hasLintScript && !hasEslint) {
    continue; // no linter found
  }

  let cmd, args;
  if (hasLintScript) {
    cmd = 'npm';
    args = ['run', 'lint'];
    if (fix) args.push('--', '--fix');
  } else {
    // run eslint directly via npx
    cmd = 'npx';
    args = ['eslint', '.', '--ext', '.js,.jsx,.ts,.tsx'];
    if (fix) args.push('--fix');
  }

  console.log(`\n==> Running linter in ${dir}`);
  console.log('Command:', cmd, args.join(' '));
  const res = spawnSync(cmd, args, { cwd: dir, stdio: 'inherit', encoding: 'utf8' });
  const success = res.status === 0;
  summary.push({ project: dir, lintScript: !!hasLintScript, eslintInstalled: !!hasEslint, success, status: res.status });
}

const failed = summary.filter(s => s.success === false);
if (outJson) {
  console.log(JSON.stringify({ checked: summary.length, failures: failed.length, summary }, null, 2));
  process.exit(failed.length === 0 ? 0 : 2);
}

console.log(`\nRan linter in ${summary.length} project(s). ${failed.length} failed.`);
for (const f of failed) console.log(' - Failed:', f.project, 'status=' + f.status);

if (failed.length > 0) process.exit(2);

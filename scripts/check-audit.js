#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function usage() {
  console.log('Usage: node scripts/check-audit.js [--json] [--root=<path>]');
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

const pkgs = findPackageJsons(root);
const results = [];

for (const pj of pkgs) {
  const dir = path.dirname(pj);
  const cmd = 'npm';
  const args = ['audit', '--json'];
  // run npm audit in project dir
  const res = spawnSync(cmd, args, { cwd: dir, encoding: 'utf8' });
  const stdout = (res.stdout || '').trim();
  const stderr = (res.stderr || '').trim();
  let parsed = null;
  if (stdout) {
    try { parsed = JSON.parse(stdout); } catch (e) { /* ignore */ }
  }
  if (!parsed && stderr) {
    try { parsed = JSON.parse(stderr); } catch (e) { /* ignore */ }
  }

  if (!parsed) {
    // couldn't get JSON output; record error (likely audit failed or no install)
    const message = stderr || stdout || `audit returned exit ${res.status}`;
    results.push({ project: dir, error: message });
    continue;
  }

  // Normalize vulnerabilities info across npm versions
  let vulnerabilities = [];
  if (parsed.vulnerabilities && typeof parsed.vulnerabilities === 'object') {
    // parsed.vulnerabilities: object keyed by module name
    for (const [name, info] of Object.entries(parsed.vulnerabilities)) {
      vulnerabilities.push({ name, severity: info.severity || 'unknown', via: info.via || info.findings || [] });
    }
  } else if (parsed.advisories && typeof parsed.advisories === 'object') {
    // older npm: advisories keyed by id
    for (const adv of Object.values(parsed.advisories)) {
      vulnerabilities.push({ name: adv.module_name || adv.module, severity: adv.severity || 'unknown', url: adv.url });
    }
  } else if (parsed.metadata && parsed.metadata.vulnerabilities) {
    // metadata.vulnerabilities gives counts by severity
    const meta = parsed.metadata.vulnerabilities;
    vulnerabilities.push({ summary: meta });
  }

  results.push({ project: dir, vulnerabilities });
}

const projectsWithVulns = results.filter(r => r.vulnerabilities && r.vulnerabilities.length > 0);

if (outJson) {
  console.log(JSON.stringify({ checked: results.length, vulnerableCount: projectsWithVulns.length, results }, null, 2));
  process.exit(projectsWithVulns.length > 0 ? 1 : 0);
}

console.log(`Checked ${results.length} project(s). ${projectsWithVulns.length} project(s) reported vulnerabilities or audit info.`);
for (const r of results) {
  if (r.error) {
    console.log('\n==> ' + r.project);
    console.log('  - Audit error:', r.error);
  } else if (r.vulnerabilities && r.vulnerabilities.length > 0) {
    console.log('\n==> ' + r.project);
    for (const v of r.vulnerabilities) {
      if (v.name) console.log(`  - ${v.name}: severity=${v.severity}`);
      else console.log('  -', v);
    }
  }
}

if (projectsWithVulns.length === 0) console.log('\nNo vulnerabilities reported by `npm audit` (projects may need `npm install` for accurate results).');

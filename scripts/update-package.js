#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { findPackageJsons } = require('./utils');

function usage() {
  console.log(`Usage: node scripts/update-package.js <package-name> [--dev] [--manager=npm|yarn|pnpm] [--dry-run]\n\nExample:\n  node scripts/update-package.js lodash --manager npm --dry-run`);
  process.exit(1);
}

const argv = process.argv.slice(2);
if (argv.length === 0) usage();

let packageName = null;
let version = null;
let devFlag = false;
let manager = 'npm';
let dryRun = false;

for (const arg of argv) {
  if (arg === '--dev') devFlag = true;
  else if (arg === '--dry-run') dryRun = true;
  else if (arg.startsWith('--manager=')) manager = arg.split('=')[1];
  else if (arg.startsWith('--version=')) version = arg.split('=')[1];
  else if (!packageName) packageName = arg;
  else usage();
}

if (!packageName) usage();

const root = process.cwd();
const allPkgJsons = findPackageJsons(root);

const toUpdate = [];
for (const pj of allPkgJsons) {
  try {
    const json = JSON.parse(fs.readFileSync(pj, 'utf8'));
    const deps = json.dependencies || {};
    const devDeps = json.devDependencies || {};
    if (deps[packageName] || devDeps[packageName]) {
      const dir = path.dirname(pj);
      const currentlyDev = !!devDeps[packageName];
      toUpdate.push({ pkgPath: pj, dir, currentlyDev });
    }
  } catch (e) {
    console.warn('Warning: could not read/parse', pj);
  }
}

if (toUpdate.length === 0) {
  console.log('No projects found with', packageName);
  process.exit(0);
}

console.log(`Found ${toUpdate.length} project(s) with ${packageName}.`);

for (const item of toUpdate) {
  const { dir, currentlyDev } = item;
  let installAsDev = devFlag ? true : (devFlag === false && !devFlag ? currentlyDev : false);
  if (devFlag) installAsDev = true;
  // If user didn't pass --dev, preserve whether the dep was in devDependencies
  if (!devFlag) installAsDev = currentlyDev;

  let cmd;
  const target = version ? `${packageName}@${version}` : `${packageName}@latest`;
  if (manager === 'npm') {
    cmd = `npm install ${target} ${installAsDev ? '--save-dev' : '--save'}`;
  } else if (manager === 'yarn') {
    cmd = `yarn add ${target} ${installAsDev ? '--dev' : ''}`;
  } else if (manager === 'pnpm') {
    cmd = `pnpm add ${installAsDev ? '-D ' : ''}${target}`;
  } else {
    console.error('Unsupported manager:', manager);
    process.exit(2);
  }

  console.log('\n==> Project:', dir);
  console.log('Running:', cmd);
  if (dryRun) continue;

  try {
    execSync(cmd, { cwd: dir, stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to update in', dir, e.message);
  }
}

console.log('\nDone.');

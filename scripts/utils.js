const fs = require('fs');
const path = require('path');

function findPackageJsons(dir, ignore = new Set(['node_modules','.git','dist','coverage','public'])) {
  const out = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return out; }
  for (const e of entries) {
    if (ignore.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isFile() && e.name === 'package.json') out.push(full);
    else if (e.isDirectory() && !e.isSymbolicLink()) out.push(...findPackageJsons(full, ignore));
  }
  return out;
}

function parseJsonOutput(stdout, stderr) {
  if (stdout) {
    try { return JSON.parse(stdout); } catch {}
  }
  if (stderr) {
    try { return JSON.parse(stderr); } catch {}
  }
  return null;
}

module.exports = { findPackageJsons, parseJsonOutput };

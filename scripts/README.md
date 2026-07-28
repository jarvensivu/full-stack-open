# Scripts

Scripts for auditing, updating, and managing dependencies across all projects in the repository.

---

## check-audit.js

Runs `npm audit` across all projects and reports vulnerabilities.

**Usage**

```bash
node scripts/check-audit.js [options]
```

**Options**

- `--json` — output machine-readable JSON summary (exits with code 1 if vulnerabilities found)
- `--root=<path>` — search from a different root directory

**Examples**

```bash
# Basic audit
node scripts/check-audit.js

# Machine-readable output for CI
node scripts/check-audit.js --json
```

**Notes**

- Runs `npm audit --json` in each directory containing a `package.json`.
- Dependencies must be installed (`npm install`) for accurate results, because `npm audit` operates on installed packages.
- Ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Requires `npm` to be available in your PATH.

---

## check-outdated.js

Checks for outdated dependencies across all projects.

**Usage**

```bash
node scripts/check-outdated.js [options]
```

**Options**

- `--json` — output machine-readable JSON summary
- `--root=<path>` — search from a different root directory

**Examples**

```bash
# Basic check
node scripts/check-outdated.js

# Machine-readable output for CI
node scripts/check-outdated.js --json
```

**Notes**

- Uses `npm outdated --json --depth=0` in each directory containing a `package.json`.
- Ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Requires `npm` to be available in your PATH. Version checks always use `npm`, even for projects that may use `yarn` or `pnpm`.

---

## install-deps.js

Installs dependencies across all projects.

**Usage**

```bash
node scripts/install-deps.js [options]
```

**Options**

- `--ci` — run `npm ci` instead of `npm install`
- `--json` — output machine-readable JSON summary
- `--root=<path>` — search from a different root directory

**Examples**

```bash
# Install all dependencies
node scripts/install-deps.js

# Clean install (useful in CI)
node scripts/install-deps.js --ci

# Limit to a subdirectory
node scripts/install-deps.js --root=./part_6
```

**Notes**

- Runs `npm install` (or `npm ci`) in each directory containing a `package.json`.
- Ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Requires `npm` to be available in your PATH.

---

## run-linters.js

Runs the linter across all projects that have one configured.

**Usage**

```bash
node scripts/run-linters.js [options]
```

**Options**

- `--fix` — attempt automatic fixes where supported
- `--json` — output machine-readable JSON summary (exits with code 2 if any linter fails)
- `--root=<path>` — search from a different root directory

**Examples**

```bash
# Run linters across all projects
node scripts/run-linters.js

# Auto-fix lint errors where possible
node scripts/run-linters.js --fix

# Limit to a subdirectory
node scripts/run-linters.js --root=./part_6

# Machine-readable output for CI
node scripts/run-linters.js --json
```

**Notes**

- Searches recursively for `package.json` files.
- For each project: if a `scripts.lint` entry exists, runs `npm run lint`; otherwise, if `eslint` or `@eslint/js` is listed as a dependency, runs `npx eslint . --ext .js,.jsx,.ts,.tsx`.
- Projects without a lint script or eslint dependency are skipped.
- Ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Requires `npm` and `npx` to be available in your PATH.

---

## update-package.js

Updates a named package across all projects that already list it as a dependency.

**Usage**

```bash
node scripts/update-package.js <package-name> [options]
```

**Options**

- `--dev` — force installation as a dev dependency (default: preserves existing placement)
- `--version=<semver>` — install a specific version instead of `latest`
- `--dry-run` — print what would be changed without modifying any files
- `--root=<path>` — search from a different root directory

**Examples**

```bash
# Preview changes before applying
node scripts/update-package.js lodash --dry-run

# Update to latest in all projects that use it
node scripts/update-package.js lodash

# Install a specific version
node scripts/update-package.js jest --version=29.5.0

# Force install as a dev dependency
node scripts/update-package.js jest --dev

# Limit to a subdirectory
node scripts/update-package.js lodash --root=./part_6
```

**Notes**

- Searches recursively from the root for `package.json` files and only updates projects that already list the package.
- Preserves dev vs. prod placement unless `--dev` is passed.
- Uses `npm` only. No other package managers are supported.
- Run with `--dry-run` first to verify which projects will be changed.

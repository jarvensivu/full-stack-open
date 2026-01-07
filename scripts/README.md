# check-audit.js

Audit packages across all projects

Usage:

From the repository root run:

```bash
node scripts/check-audit.js
```

Options:
- `--json` — output machine-readable JSON summary (exit code 1 if vulnerabilities found)
- `--root=<path>` — search from a different root directory

Notes:
- The script runs `npm audit --json` in each folder that contains a `package.json`.
- For accurate results the project's dependencies should be installed (`npm install`) because `npm audit` operates on installed packages.
- It ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Ensure `npm` is available in your PATH.


# check-outdated.js

Checks outdated dependencies across the repo

Usage:

From the repository root run:

```bash
node scripts/check-outdated.js
```

Options:
- `--json` — output machine-readable JSON summary
- `--root=<path>` — search from a different root directory

Notes:
- The script uses `npm outdated --json --depth=0` in each folder that contains a `package.json`.
- It ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.
- Ensure `npm` is available in your PATH. The script uses `npm` to check versions even for projects that may use `yarn` or `pnpm`.

Example:

```bash
node scripts/check-outdated.js --json
```

# run-linters.js

Run linter across projects that include a linter

Usage (from repository root):

```bash
node scripts/run-linters.js  # run linter where available
node scripts/run-linters.js --fix # run with --fix where supported
node scripts/run-linters.js --json # output machine-readable JSON
node scripts/run-linters.js --root=./part_6 # search from a different root
```

Behavior:
- The script searches recursively for `package.json` files.
- For each project: if it has a `scripts.lint` entry, it runs `npm run lint`.
- If no `lint` script exists but `eslint` (or `@eslint/js`) is listed in dependencies, it runs `npx eslint . --ext .js,.jsx,.ts,.tsx`.
- Pass `--fix` to attempt automatic fixes where supported.
- Output can be produced as JSON with `--json` for automation.

Notes:
- Ensure `npm` and `npx` are available in your PATH.
- The script intentionally ignores `node_modules`, `.git`, `dist`, `coverage`, and `public` directories while searching.


# update-package.js

A small Node script to update a dependency to the latest or specified version across all projects

Usage examples:

- Dry-run with npm (does not modify files):

```bash
node scripts/update-package.js lodash --dry-run
```

- Actually update (preserves dev vs prod placement unless `--dev` passed):

```bash
node scripts/update-package.js lodash
```

- Force install as dev-dependency:

```bash
node scripts/update-package.js jest --dev
```

- Use `--version=<semver>` to install the specified version instead of `latest`
```bash
node scripts/update-package.js jest --version=29.5.0
```

Notes:
- Script searches recursively from the repository root for `package.json` files and updates projects that already list the package.
- Uses `npm`. No other managers are supported
- Run with `--dry-run` first to verify which projects will be changed.

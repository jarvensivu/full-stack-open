# update-package.js

A small Node script to update a dependency to the latest version across all projects

Usage examples:

- Dry-run with npm (does not modify files):

```bash
node scripts/update-package.js lodash --manager=npm --dry-run
```

- Actually update (preserves dev vs prod placement unless `--dev` passed):

```bash
node scripts/update-package.js lodash --manager=npm
```

- Force install as dev-dependency:

```bash
node scripts/update-package.js jest --manager=npm --dev
```

Notes:
- Script searches recursively from the repository root for `package.json` files and updates projects that already list the package.
- Supported managers: `npm`, `yarn`, `pnpm`.
- Run with `--dry-run` first to verify which projects will be changed.

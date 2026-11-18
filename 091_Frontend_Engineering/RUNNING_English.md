# Installation, execution, and verification

[Persian](RUNNING_Persian.md) · [Course](README_English.md)

## Installation and working directory

Use Node 24 or newer, its bundled npm, and a current browser. On Windows choose an architecture-appropriate MSI from the [official Node download page](https://nodejs.org/en/download) and reopen the terminal after installation. On macOS use the official package; on Linux use official binaries or a version manager linked there. Install separately inside WSL and do not share node_modules with Windows.

Every command in this guide runs from this course root unless it includes its own cd:

```bat
cmd /c "cd /d C:\Users\Edris\MyProjects\Software_Engineer\091_Frontend_Engineering"
```

A cd inside cmd /c affects only that child process. Set your terminal working directory to this path, or combine cd /d and the next command inside the same cmd /c. On Linux and macOS enter the same directory, omit cmd /c, and use / path separators.

## Core checks: no package installation

```bat
cmd /c node --version
cmd /c node scripts/check.mjs
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node examples/003_values.mjs
cmd /c node examples/007_event_loop.mjs
cmd /c node examples/010_types.ts
```

check verifies 64 lessons, language pairs, local links, RTL wrappers, and JavaScript syntax. Core tests cover money, search, reducers, persistence, API handling, stale responses, and server boundaries. Example 003 prints a total of 9700 cents. Example 007 prints start, end, promise, microtask, then timer. Example 010 prints 1 products, then 4500. Node execution of TypeScript strips types; independent type checking runs through the React project.

## Browser examples

```bat
cmd /c node scripts/serve.mjs --duration=600
```

Open http://127.0.0.1:4173/. This loopback-only teaching server closes automatically after 600 seconds; Ctrl+C also closes it. Allowed duration is 1–3600 seconds. If the port is occupied, identify your own process rather than terminating an unknown one. Tests choose an ephemeral port and close their own server. file:// is unsuitable for module and worker labs.

Inputs and outputs appear in the [example guide](examples/README_English.md). The server exposes local data at /api/products, a 503 at /api/failure, and three finite events at /api/events. No external backend or credentials are required.

## Isolated React project

```bat
cmd /c "cd projects\003_react_dashboard && npm ci"
cmd /c "cd projects\003_react_dashboard && npm run typecheck"
cmd /c "cd projects\003_react_dashboard && npm run build"
```

npm ci needs internet and the included project lockfile. For deliberate manifest updates use npm install and review version diffs; do not delete the lockfile merely to bypass a failure. Versions are exact, and the lock is the repeatable installation reference. build must complete type checking and bundling and produce dist. With the same lab server, open http://127.0.0.1:4173/projects/003_react_dashboard/dist/index.html. These dependencies are separate from the optional root package. This course does not require a persistent development server.

## Optional browser tests

Build the React project first, then from the course root:

```bat
cmd /c npm ci
cmd /c npx playwright install chromium
cmd /c npm run e2e
```

The first Playwright/browser installation needs network access and disk space. Tests are headless, use isolated browser contexts, and close their temporary server. Eight flows cover search/history, persistence/focus, corrupt storage, narrow layout, HTTP failure, workers, SSE, and React. See the [validation report](VALIDATION_English.md) for actual execution status. Automation does not replace screen-reader testing, real devices, or production security review.

## Troubleshooting

An npm EACCES may reflect network restrictions or cache permissions; inspect the exact error and environment policy instead of blindly using administrator privileges. For a blank screen inspect Console, Network, and the built file path. For Module not found, verify the installation directory and lockfile consistency. The service-worker lab takes control on a subsequent navigation after registration; use its cache-removal button and close the tab when finished.

Installation references: [Node](https://nodejs.org/en/download), [Vite](https://vite.dev/guide/), [npm ci](https://docs.npmjs.com/cli/v11/commands/npm-ci), and [Playwright](https://playwright.dev/docs/intro).

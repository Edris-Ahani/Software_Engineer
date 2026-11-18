# 002 — Environment and installation

[Persian](./002_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Install a supported Node.js LTS from the official download page. On Windows choose the MSI matching your architecture, keep npm and PATH enabled, reopen Command Prompt, and run the version commands below. On macOS use the official package; on Linux use the official binaries or a maintained version manager linked by Node. WSL has its own filesystem, Node installation, and packages: do not share node_modules with Windows.

Install an editor and a current browser with DevTools. The core labs have no npm dependencies and require Node 24 or newer. The optional React project owns its dependencies and lockfile; install inside that project only. Avoid administrator privileges for routine package installation. A Node runtime is tooling for these lessons, not the browser's JavaScript engine.

## Common mistakes

If node is missing, reopen the terminal and inspect PATH. Never paste an unknown installation script into an elevated terminal.

## Exercise and acceptance criteria

Run cmd /c node --version and cmd /c npm --version, then run cmd /c node scripts/check.mjs from the course root.

## Solution guidance

Version commands print installed versions; check.mjs reports documentation and syntax checks. Linux and macOS use the same Node commands without cmd /c.

## Official reference

[Primary documentation](https://nodejs.org/en/download)

[Previous](../001_Web_and_Frontend/001_Lesson_English.md) · [Next](../003_Git_and_Workflow/003_Lesson_English.md)

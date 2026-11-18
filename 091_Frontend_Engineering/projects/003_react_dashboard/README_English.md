# React and TypeScript dashboard

[Persian](README_Persian.md) · [Course](../../README_English.md) · [Complete run guide](../../RUNNING_English.md)

## Purpose and prerequisites

Typed components, shared reducer contracts, derived filters, form feedback, and a production artifact.

Prerequisites: JavaScript, TypeScript, React basics, and Node 24 or newer. Dependencies and their lockfile are isolated in this project.

## Execution and input

Run from the course root:

```bat
cmd /c "cd projects\003_react_dashboard && npm ci"
cmd /c "cd projects\003_react_dashboard && npm run build"
cmd /c node scripts/serve.mjs --duration=600
```

Open http://127.0.0.1:4173/projects/003_react_dashboard/dist/index.html. Inputs are a task title and the All, Open, or Done filter. The server closes after 600 seconds.

## Expected output and acceptance criteria

Initial data has two tasks, one complete. Add a task, switch to Done, and see only completed tasks. Reload restores initial samples because this reference does not persist React state.

Repeat the task with Tab and Enter. Essential content must remain available at narrow widths. Markup-like titles must display literally without executing code.

## Verification

```bat
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node scripts/check.mjs
```

After installing optional tools and building React, run cmd /c npm run e2e from the course root. Browser tests cover these visible workflows. See the [report](../../VALIDATION_English.md) for installation, actual results, and limitations.

## Limitations and extension exercise

No API, persistence, authentication, routing library, or server-state cache. Add these one boundary at a time after specifying ownership, validation, and failure states.

Write acceptance criteria and failure states for the chosen extension first. Keep domain logic in lib and UI details in this project. All examples are local teaching applications.

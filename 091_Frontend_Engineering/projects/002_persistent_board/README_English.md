# Persistent task board

[Persian](README_Persian.md) · [Course](../../README_English.md) · [Complete run guide](../../RUNNING_English.md)

## Purpose and prerequisites

Pure task transitions, immutable updates, untrusted text rendering, versioned storage, failure recovery, and focus restoration.

Prerequisites: HTML, CSS, DOM basics, and Node 24 or newer for the local server. No npm dependencies.

## Execution and input

Run from the course root:

```bat
cmd /c node scripts/serve.mjs --duration=600
```

Open http://127.0.0.1:4173/projects/002_persistent_board/index.html. Inputs come from the page form; initial data does not depend on an external network. The server closes after 600 seconds.

## Expected output and acceptance criteria

Add a title, complete it, reload, and observe one completed task. Remove it and focus returns to the input. Corrupt stored JSON: memory mode preserves the original saved value until reset.

Repeat the task with Tab and Enter. Essential content must remain available at narrow widths. Markup-like titles must display literally without executing code.

## Verification

```bat
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node scripts/check.mjs
```

After installing optional tools and building React, run cmd /c npm run e2e from the course root. Browser tests cover these visible workflows. See the [report](../../VALIDATION_English.md) for installation, actual results, and limitations.

## Limitations and extension exercise

Single-user local data only, at most 1000 tasks and 120 characters per title. No cross-tab conflict resolution, backend, or backup. Add an IndexedDB adapter and conflict policy as extensions.

Write acceptance criteria and failure states for the chosen extension first. Keep domain logic in lib and UI details in this project. All examples are local teaching applications.

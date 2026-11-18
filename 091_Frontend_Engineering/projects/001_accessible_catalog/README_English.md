# Accessible catalog

[Persian](README_Persian.md) · [Course](../../README_English.md) · [Complete run guide](../../RUNNING_English.md)

## Purpose and prerequisites

Semantic HTML, responsive CSS, local search, URL parameters, history, and result announcements.

Prerequisites: HTML, CSS, DOM basics, and Node 24 or newer for the local server. No npm dependencies.

## Execution and input

Run from the course root:

```bat
cmd /c node scripts/serve.mjs --duration=600
```

Open http://127.0.0.1:4173/projects/001_accessible_catalog/index.html. Inputs come from the page form; initial data does not depend on an external network. The server closes after 600 seconds.

## Expected output and acceptance criteria

Search keyboard: one product. Search an absent name: zero products. Reload retains the query; back/forward restores earlier searches.

Repeat the task with Tab and Enter. Essential content must remain available at narrow widths. Markup-like titles must display literally without executing code.

## Verification

```bat
cmd /c node --test tests/core.test.mjs tests/server.test.mjs
cmd /c node scripts/check.mjs
```

After installing optional tools and building React, run cmd /c npm run e2e from the course root. Browser tests cover these visible workflows. See the [report](../../VALIDATION_English.md) for installation, actual results, and limitations.

## Limitations and extension exercise

No remote API, authentication, cart, checkout, or production SEO configuration. Add a category filter and keyboard review as extensions.

Write acceptance criteria and failure states for the chosen extension first. Keep domain logic in lib and UI details in this project. All examples are local teaching applications.

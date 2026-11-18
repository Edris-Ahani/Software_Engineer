# Validation report

[Persian](VALIDATION_Persian.md) · [Course](README_English.md) · [Reproduction guide](RUNNING_English.md)

Authoring and verification date: 2026-11-18. Environment: Windows, Node v24.16.0, npm 11.13.0. Shell commands were executed through terminating cmd /c processes. This report covers local verification; no deployment or remote push was performed.

## Executed checks

| Check | Result |
| --- | --- |
| Documentation, counterpart files, relative Markdown links, full RTL wrappers, source-language scan, JavaScript syntax | Pass using scripts/check.mjs |
| Core domain and HTTP-server tests | 7 passed, 0 failed |
| Six independent Node/TypeScript examples | Expected outputs confirmed |
| React TypeScript check, including the standalone TypeScript lesson | Pass |
| Vite production build | Pass; dist generated |
| Chromium headless end-to-end flows | 8 passed, 0 failed |

The React package installed 23 packages with install scripts disabled. Its pinned direct versions are React/React DOM 19.3.1, TypeScript 7.0.2, Vite 8.3.8, and React type packages 19.3.0. The optional root browser-test package uses Playwright 1.65.1. Both packages include lockfiles. Chrome Headless Shell revision 1255 was installed for verification after the initial browser launch reported its executable missing. The subsequent complete browser run passed.

## Behavior covered

Core tests verify valid and invalid integer money, search normalization, immutable task transitions, duplicate/oversized records, persistence schema rejection, HTTP errors, malformed JSON, aborted requests, and stale-response ownership. Server tests verify local HTML delivery, 404/405/503 responses, protected paths, malformed URLs, HEAD behavior, and a finite SSE stream.

Browser tests verify catalog search/reload/history, literal rendering of markup-like task titles, toggle focus, persistence after reload, remove focus, corrupt-data preservation until explicit reset, a 320px layout, fetch success/failure, worker output, three SSE events with closure, and React add/filter behavior.

Node examples 003–007 and 010 were executed. They confirmed 9700 cents, independent closures and debounce, unchanged original objects, category fallback, event-loop ordering, and typed-state output. The compiler checks the TypeScript example separately; Node type stripping alone was not treated as a type check.

## Reproduce

Run from the course root using the exact commands in the [run guide](RUNNING_English.md). Core checks require no package installation. React build and browser checks require their isolated dependencies and the Playwright browser. The test server binds only to loopback, uses an ephemeral test port, and is closed by each suite.

Generated dist, node_modules, and disposable test output are ignored by this topic's .gitignore. Source, guides, maintained tests, configuration, and lockfiles are the reproducible deliverables.

## Limits

No production deployment, real API authentication, payment, CDN configuration, field Web Vitals collection, or external service integration was tested. Screen-reader behavior, full WCAG conformance, service-worker offline behavior, visual regression, Safari/Firefox, and real-device performance were not manually certified. The examples for these subjects remain study material with explicit limitations. Passing tests is not a production-readiness claim or a guarantee of senior-level competence.

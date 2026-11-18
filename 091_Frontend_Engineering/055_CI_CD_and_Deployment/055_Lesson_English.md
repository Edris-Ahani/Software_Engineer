# 055 — CI/CD and deployment

[Persian](./055_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A delivery pipeline reproduces the build from source and a lockfile, then checks types, tests, and output before publishing an artifact. Build once and promote the same artifact where practical. Browser configuration is public; private credentials belong on trusted infrastructure.

Static hosting serves built assets, while SSR needs a compatible runtime and capacity planning. A path-based SPA needs route fallback, but asset misses should stay 404. Publish assets before switching HTML and keep old hashed files long enough for open tabs. Add health checks, staged rollout, monitoring, and a tested rollback. Local preview verifies an artifact; it is not a production server configuration.

## Common mistakes

A green build does not prove deployment headers, paths, auth redirects, or CDN invalidation are correct. Avoid rebuilding differently on every server.

## Exercise and acceptance criteria

Write a pipeline for the React project with npm ci, typecheck, build, core tests, artifact storage, smoke checks, and rollback criteria.

## Solution guidance

Keep checks before publication, serve dist under its intended base path, and verify a direct route load plus recovery from a missing asset.

## Related code

- [package.json](../examples/../projects/003_react_dashboard/package.json)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://vite.dev/guide/static-deploy)

[Previous](../054_Graphics_Animation_and_Specialized_APIs/054_Lesson_English.md) · [Next](../056_Observability_Analytics_and_Privacy/056_Lesson_English.md)

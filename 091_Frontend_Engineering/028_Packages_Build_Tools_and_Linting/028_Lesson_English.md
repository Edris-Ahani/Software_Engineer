# 028 — Packages, build tools, and linting

[Persian](./028_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

package.json declares scripts and dependency ranges; a lockfile records a resolved dependency graph. npm ci installs from a consistent lockfile and fails when the manifest disagrees. Runtime dependencies ship with the application or support execution; development dependencies support building and checking.

A development server serves modules and updates them quickly; a production build bundles, transforms, and optimizes for selected targets. Tree shaking depends on static structure and side-effect information. Transpiling syntax does not automatically polyfill browser APIs or type-check TypeScript. Use formatting for mechanical consistency, linting for suspicious patterns, and a separate type-check command. Values embedded in a client bundle are public, including environment variables exposed by tooling.

## Common mistakes

Do not fix a dependency failure by deleting the lockfile without understanding the change. Development server behavior is not deployment behavior.

## Exercise and acceptance criteria

Inspect the React project scripts and build output. Explain which command checks types, which bundles, and why npm ci needs a lockfile.

## Solution guidance

Keep typecheck and build explicit, commit the resolved lock, and serve the generated dist separately to test production asset paths.

## Related code

- [package.json](../examples/../projects/003_react_dashboard/package.json)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://vite.dev/guide/)

[Previous](../027_Advanced_Types_and_Runtime_Schemas/027_Lesson_English.md) · [Next](../029_Debugging_and_DevTools/029_Lesson_English.md)

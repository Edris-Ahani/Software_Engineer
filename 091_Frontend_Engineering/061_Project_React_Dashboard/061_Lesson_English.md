# 061 — Project 3: React and TypeScript dashboard

[Persian](./061_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

The React project rebuilds the task workflow with typed components, a reducer, derived filters, and a production build. Reuse the same domain contract instead of changing business rules simply because a framework is introduced. The reference uses local data and intentionally keeps deployment and credentials out of the browser.

Extend it toward a senior-level deliverable in stages: introduce a validated API adapter, query caching with user-aware keys, URL filters, optimistic updates with reconciliation, accessible error recovery, and telemetry with redaction. These extensions are design assignments, not features claimed by the reference implementation. Keep correctness tests and type checking independent from bundling.

## Common mistakes

Do not add a global store, query library, router, and component framework simultaneously before each has a clear responsibility.

## Exercise and acceptance criteria

Install the isolated project dependencies, run typecheck and build, and inspect the served dist. Propose an API migration plan with failure states.

## Solution guidance

Keep the reducer pure and typed, place remote validation at the adapter boundary, and introduce a single data owner before adding optimistic behavior.

## Related code

- [main.tsx](../examples/../projects/003_react_dashboard/src/main.tsx)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/learn/typescript)

[Previous](../060_Project_Persistent_Task_Board/060_Lesson_English.md) · [Next](../062_Interview_Code_Review_and_Assessment/062_Lesson_English.md)

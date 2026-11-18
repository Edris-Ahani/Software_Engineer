# 051 — Frontend architecture

[Persian](./051_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Architecture organizes dependencies so a change has a manageable scope. Group code by business feature when features change independently. Keep domain rules pure, application orchestration explicit, and infrastructure such as HTTP and storage behind narrow adapters. Components translate state and events into UI rather than owning every concern.

Avoid both a giant shared folder and an abstraction for every line. Extract shared behavior after its stable contract is understood. Enforce import direction and keep feature internals private where practical. A monorepo can coordinate packages and tooling, but adds dependency graph and release complexity. Write an architecture decision record with context, options, decision, and consequences for meaningful tradeoffs.

## Common mistakes

Dependency injection does not require a framework. A wrapper that simply renames every library method can add maintenance without creating a useful boundary.

## Exercise and acceptance criteria

Replace local persistence in the task project with an in-memory adapter without changing task validation or transition logic.

## Solution guidance

Define load/save at the persistence boundary, inject the adapter, and keep storage exceptions out of the domain reducer.

## Related code

- [tasks.mjs](../examples/../lib/tasks.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/learn/thinking-in-react)

[Previous](../050_Design_Systems_and_Component_APIs/050_Lesson_English.md) · [Next](../052_Frontend_System_Design/052_Lesson_English.md)

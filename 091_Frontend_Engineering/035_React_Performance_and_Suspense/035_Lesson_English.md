# 035 — React performance and Suspense

[Persian](./035_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Measure interaction cost before memoizing. Unnecessary state lifting, unstable context values, huge lists, and expensive calculations can dominate. memo, useMemo, and useCallback are optimization tools with their own costs; correctness must not depend on a memoized value being retained.

Transitions mark nonurgent updates so urgent input can remain responsive. Deferred values allow a slower view to lag behind a fresh input. Neither moves computation to a worker. Suspense coordinates a fallback for compatible lazy code or data sources; an ordinary fetch in useEffect does not automatically suspend. Error boundaries handle rendering failures in descendants, not every event-handler or asynchronous exception.

## Common mistakes

Memoizing every function can add complexity without reducing renders. A fallback that replaces the whole page can create a disruptive experience.

## Exercise and acceptance criteria

Profile filtering a large list. Compare a smaller dataset, virtualization, and deferring the result while keeping input immediate.

## Solution guidance

Record before and after interaction traces. Choose the smallest change that reduces measured work, and keep an accessible loading indication.

## Related code

- [main.tsx](../examples/../projects/003_react_dashboard/src/main.tsx)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/reference/react/useTransition)

[Previous](../034_Effects_Refs_and_Cleanup/034_Lesson_English.md) · [Next](../036_Server_State_Forms_and_Data/036_Lesson_English.md)

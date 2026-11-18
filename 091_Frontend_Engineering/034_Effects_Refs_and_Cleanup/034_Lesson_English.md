# 034 — Effects, refs, and cleanup

[Persian](./034_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Effects synchronize a committed component with an external system such as a subscription, timer, or browser API. They are not the default mechanism for calculating a filtered list or handling a user action. Dependencies describe reactive values used by the effect; omitting them can create stale behavior.

Cleanup undoes setup before reruns and on unmount. Development Strict Mode can deliberately repeat setup and cleanup to expose unsafe synchronization. A ref stores a mutable value without triggering a render and can refer to a DOM node, but changing ref.current does not update UI. For asynchronous effects, cancel work and also ignore results that no longer belong to the current render.

## Common mistakes

Suppressing the dependency lint rule usually conceals the model problem. An effect cleanup must not undo a newer owner’s work.

## Exercise and acceptance criteria

Add a window event subscription and a cancellable data load to a component. Mount, change dependencies, and unmount repeatedly.

## Solution guidance

Use matching add/remove listeners, an AbortController per setup, and an ownership flag or request id before applying asynchronous results.

## Related code

- [009_fetch.html](../examples/009_fetch.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/learn/synchronizing-with-effects)

[Previous](../033_React_State_and_Reducers/033_Lesson_English.md) · [Next](../035_React_Performance_and_Suspense/035_Lesson_English.md)

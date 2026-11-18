# 017 — Functions, scope, and closures

[Persian](./017_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A function packages behavior and captures access to its lexical environment. let and const are block scoped, while var is function scoped. A closure retains access to variables, not frozen copies of their values. This explains both useful private state and stale or unexpectedly shared values in callbacks.

Separate pure calculations from effects such as DOM updates and network calls. Higher-order functions accept or return functions and support reusable policies such as debounce. A debounce delays execution until input settles; a throttle limits frequency. Both need cancellation when the owner disappears. Arrow functions capture this lexically and are not substitutes for every object method.

## Common mistakes

A closure that keeps a large DOM subtree reachable can retain memory. Debouncing does not cancel an already-running request.

## Exercise and acceptance criteria

Build a counter factory and create two counters. Then implement a debounced search trigger with a cancel method.

## Solution guidance

Each counter owns an independent binding. Clear the timer on a new call and on disposal; combine request cancellation with debounce for network searches.

## Related code

- [004_closures.mjs](../examples/004_closures.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)

[Previous](../016_JavaScript_Fundamentals/016_Lesson_English.md) · [Next](../018_Objects_Prototypes_and_This/018_Lesson_English.md)

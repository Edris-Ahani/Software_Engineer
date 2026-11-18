# 021 — Async, the event loop, and cancellation

[Persian](./021_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Synchronous code runs to completion within a task. Promise reactions run as microtasks after the current stack, before the next task. Timers specify a minimum delay rather than an exact schedule. async functions always return a promise; await suspends that function but does not move CPU work to another thread.

Use Promise.all for independent operations that must all succeed, and allSettled when each result matters independently. Limit concurrency for large batches. AbortController communicates cancellation to cooperating APIs. Cancellation and stale-result protection solve related but different problems: a response may finish before cancellation, so also verify which request still owns the current UI.

## Common mistakes

forEach does not await async callbacks. An infinite microtask chain can starve rendering and timers.

## Exercise and acceptance criteria

Predict the order of synchronous logs, a resolved promise, queueMicrotask, and setTimeout. Then simulate two searches finishing in reverse order.

## Solution guidance

The synchronous logs come first, then queued microtasks, then the timer. Use a monotonically increasing request id to ignore an outdated search.

## Related code

- [007_event_loop.mjs](../examples/007_event_loop.mjs)
- [009_fetch.html](../examples/009_fetch.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model)

[Previous](../020_Modules_and_Error_Handling/020_Lesson_English.md) · [Next](../022_DOM_Events_and_Lifecycle/022_Lesson_English.md)

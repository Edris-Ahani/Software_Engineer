# 020 — Modules and error handling

[Persian](./020_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

ES modules expose explicit imports and exports and run in strict mode. Keep module responsibilities small: domain logic should not import the browser DOM or networking adapter. Circular dependencies can expose partially initialized bindings and usually signal unclear ownership.

Throw errors for exceptional failure and represent expected domain states explicitly. Catch at boundaries where recovery, user feedback, or logging has a purpose. Preserve the original cause when wrapping an error. Do not swallow rejected promises or expose raw stack traces to users. Logging should include a safe operation name and correlation information, while excluding tokens and sensitive payloads.

## Common mistakes

A catch that returns an empty list turns failure into a false empty state. A module import can execute top-level side effects.

## Exercise and acceptance criteria

Separate validation, data access, and rendering into modules. Give an invalid payload a distinct result from a network failure.

## Solution guidance

Use a small typed or tagged result at the boundary, keep pure validation independent, and let the UI map each failure to a useful message.

## Related code

- [009_fetch.html](../examples/009_fetch.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

[Previous](../019_Collections_and_Algorithms/019_Lesson_English.md) · [Next](../021_Async_Event_Loop_and_Cancellation/021_Lesson_English.md)

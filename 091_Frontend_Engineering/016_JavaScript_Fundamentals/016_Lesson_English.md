# 016 — JavaScript fundamentals

[Persian](./016_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

JavaScript values include undefined, null, booleans, numbers, bigints, strings, symbols, and objects. const prevents rebinding a variable; it does not freeze an object. Prefer explicit conversion at boundaries: Number("") is zero, while Number("abc") is NaN. Use Number.isFinite and domain constraints before doing arithmetic with user input.

Understand truthiness and the difference between || and ??: the latter defaults only for null or undefined, preserving zero and empty strings. Use strict equality by default. Floating-point arithmetic cannot represent every decimal exactly; represent money with validated integer minor units when the currency model permits it. Branches and loops should express the business rule clearly before being shortened.

## Common mistakes

Do not use a falsy check when zero is valid, or parse currency with parseInt and silently discard decimals.

## Exercise and acceptance criteria

Calculate a cart total from integer prices and quantities. Reject negative, fractional, nonfinite, and unsafe integer inputs.

## Solution guidance

Validate each item before summing and validate the final integer range. Keep formatting separate from calculation.

## Related code

- [003_values.mjs](../examples/003_values.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types)

[Previous](../015_CSS_Architecture_and_Motion/015_Lesson_English.md) · [Next](../017_Functions_Scope_and_Closures/017_Lesson_English.md)

# 026 — TypeScript fundamentals

[Persian](./026_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

TypeScript checks a model of JavaScript before execution; types are erased and do not validate network data. Enable strict checking, model optional values explicitly, and prefer inference when it remains readable. unknown forces verification before use; any disables useful checks and spreads unchecked assumptions.

Use object types for records, unions for alternatives, and discriminants for state machines. A state such as { status: "success", data } can make impossible combinations harder to represent. Readonly expresses an API promise at compile time and does not freeze runtime objects. A type assertion tells the compiler to trust you; it performs no conversion or validation.

## Common mistakes

The non-null assertion can turn a compiler warning into a runtime crash. Type stripping executes code but does not perform type checking.

## Exercise and acceptance criteria

Model idle, loading, success, and error states without optional data and error properties on every state. Render every case exhaustively.

## Solution guidance

Use a discriminated union and a never-based exhaustive check. Validate API input before constructing a success value.

## Related code

- [010_types.ts](../examples/010_types.ts)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

[Previous](../025_URLs_and_Client_Routing/025_Lesson_English.md) · [Next](../027_Advanced_Types_and_Runtime_Schemas/027_Lesson_English.md)

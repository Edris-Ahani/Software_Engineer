# 027 — Advanced types and runtime schemas

[Persian](./027_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Generics preserve relationships between inputs and outputs, such as a selector returning the value type of a selected key. keyof and indexed access describe those relationships. Mapped and conditional types derive types from existing models; utility types such as Pick and Omit can reduce duplication.

Complex types are useful only when they improve the caller's contract. Keep public types understandable and avoid accepting a partial server model for every operation. Validate unknown JSON with explicit guards or a schema library, then map transport data into domain types. Branded identifiers can prevent accidental mixing at compile time but still require runtime validation. Compiler checks and runtime checks protect different boundaries.

## Common mistakes

A generic that only hides a cast is not type safety. A schema migration must also consider old persisted data and older clients.

## Exercise and acceptance criteria

Accept unknown product data and return a validated product with a finite nonnegative integer price. Reject arrays and null as records.

## Solution guidance

Check object shape, primitive types, integer range, and required strings. Keep validation errors tied to field paths for useful feedback.

## Related code

- [010_types.ts](../examples/010_types.ts)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://www.typescriptlang.org/docs/handbook/2/generics.html)

[Previous](../026_TypeScript_Fundamentals/026_Lesson_English.md) · [Next](../028_Packages_Build_Tools_and_Linting/028_Lesson_English.md)

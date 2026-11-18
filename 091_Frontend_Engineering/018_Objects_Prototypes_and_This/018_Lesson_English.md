# 018 — Objects, prototypes, and this

[Persian](./018_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Objects map property keys to values and may delegate lookup through a prototype chain. Class syntax builds on this model; it does not turn JavaScript into a different inheritance system. Prefer composition when behavior can be assembled from small collaborators rather than deep inheritance.

For ordinary functions, this depends on the call site. Passing an unbound method as a callback can lose its receiver. Object spread copies own enumerable properties only and is shallow: nested objects remain shared. A deliberate immutable update copies each changed path. Use Map for a keyed collection when keys are arbitrary or insertion-order operations matter, and avoid mutating prototypes.

## Common mistakes

JSON stringify/parse is not a universal deep clone: it changes or rejects dates, undefined, bigints, and cycles.

## Exercise and acceptance criteria

Update a nested address without mutating the original user. Demonstrate why a shallow copy still shares the address object.

## Solution guidance

Copy the outer user and its address. Compare old and new references, and assert that the original city remains unchanged.

## Related code

- [005_objects.mjs](../examples/005_objects.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)

[Previous](../017_Functions_Scope_and_Closures/017_Lesson_English.md) · [Next](../019_Collections_and_Algorithms/019_Lesson_English.md)

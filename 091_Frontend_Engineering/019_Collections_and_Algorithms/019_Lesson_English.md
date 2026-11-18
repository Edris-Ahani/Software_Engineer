# 019 — Collections and practical algorithms

[Persian](./019_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Choose data structures from operations. Arrays support ordered traversal; Set supports uniqueness; Map supports keyed lookup. Filtering n rows is O(n); sorting is generally O(n log n); repeatedly scanning a second array inside a loop can create O(n*m) work. Indexing by id often removes that nested scan at the cost of extra memory.

Array methods differ in mutation: sort and reverse mutate, while toSorted and toReversed return copies in supporting runtimes. Stable identifiers are more reliable than positions for selections and component keys. For large collections, combine server pagination with bounded client state; virtualization reduces mounted DOM but does not reduce downloaded data.

## Common mistakes

Do not optimize a tiny loop while rendering thousands of unnecessary nodes. Remember that Map lookup complexity is implementation dependent, with sublinear average access required.

## Exercise and acceptance criteria

Join products with category names without using find inside map. Handle unknown categories and duplicate product identifiers explicitly.

## Solution guidance

Build a category Map once, then perform one product traversal. Define a fallback label and a duplicate-id rejection policy.

## Related code

- [006_collections.mjs](../examples/006_collections.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

[Previous](../018_Objects_Prototypes_and_This/018_Lesson_English.md) · [Next](../020_Modules_and_Error_Handling/020_Lesson_English.md)

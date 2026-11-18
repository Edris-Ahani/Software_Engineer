# 060 — Project 2: persistent task board

[Persian](./060_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

The task board adds explicit domain rules and persistence to a small UI. A pure reducer handles add, toggle, and remove actions. Stored records have a schema version and are validated before entering application state. Persistence failures must leave an operable memory-only interface with an honest status.

Build validation first and protect it with boundary tests. Then connect form submission, list actions, focus restoration, and storage. Titles are untrusted text and ids are stable. The reference is single-user and local-only; it has no server synchronization, authentication, cross-tab conflict resolution, or durable backup.

## Common mistakes

Do not silently erase malformed persisted data and immediately overwrite it. Explain recovery and require a deliberate reset.

## Exercise and acceptance criteria

Add, toggle, remove, and reload tasks. Corrupt the saved schema and simulate storage write failure while verifying continued operation.

## Solution guidance

Use guarded load/save, a visible reset control, and immutable transitions. Keep invalid stored content intact until the user explicitly resets it.

## Related code

- [index.html](../examples/../projects/002_persistent_board/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

[Previous](../059_Project_Accessible_Catalog/059_Lesson_English.md) · [Next](../061_Project_React_Dashboard/061_Lesson_English.md)

# 024 — Storage and IndexedDB

[Persian](./024_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Keep ephemeral interaction state in memory. sessionStorage is scoped to a page session; localStorage persists per origin and is synchronous. IndexedDB stores structured data asynchronously with indexes and transactions and suits larger offline datasets. Cookies participate in HTTP requests according to their scope and attributes.

All browser persistence can fail because of quota, privacy settings, user deletion, or malformed old data. Version stored schemas, validate on read, and offer recovery without silently destroying valuable work. Never regard local state as authoritative for authorization or payment. An HttpOnly cookie is inaccessible to JavaScript, while localStorage is readable by any script executing in the origin.

## Common mistakes

Do not store access tokens in localStorage as a default policy, or assume JSON.parse cannot fail. Storage is not a backup.

## Exercise and acceptance criteria

Persist a small task list with a schema version. Corrupt the stored JSON and verify the UI explains recovery while remaining usable.

## Solution guidance

Catch read and write errors, validate each record, preserve a useful status, and keep a memory-only fallback. Use IndexedDB when synchronous writes become costly.

## Related code

- [011_storage.html](../examples/011_storage.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

[Previous](../023_Fetch_APIs_and_Resilience/023_Lesson_English.md) · [Next](../025_URLs_and_Client_Routing/025_Lesson_English.md)

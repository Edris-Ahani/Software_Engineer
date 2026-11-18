# 036 — Server state, forms, and data management

[Persian](./036_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Local interaction state and remote server state have different lifecycles. Server state needs query keys, deduplication, staleness rules, refetching, and invalidation after mutations. A query key must include every input that changes the response, including pagination and relevant tenant scope.

Optimistic updates show a predicted result before confirmation. Preserve a rollback snapshot or operation identity, then reconcile with the authoritative response. Concurrent mutations can invalidate naive rollback. Form libraries help register controls and validation, but they do not replace accessible errors or server rules. For GraphQL, normalized entity caching can update related views, while partial errors and field authorization still need handling.

## Common mistakes

Do not copy query results into a second global store without a synchronization rule. Clear user-scoped caches on identity changes.

## Exercise and acceptance criteria

Design query keys for a tenant-specific paginated task search and an optimistic toggle. Explain two overlapping mutations.

## Solution guidance

Include tenant, filter, cursor, and sort in the key. Track mutation identities and reconcile or invalidate rather than restoring an obsolete whole-list snapshot.

## Related code

- [main.tsx](../examples/../projects/003_react_dashboard/src/main.tsx)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://tanstack.com/query/latest/docs/framework/react/overview)

[Previous](../035_React_Performance_and_Suspense/035_Lesson_English.md) · [Next](../037_Application_Routing_and_Boundaries/037_Lesson_English.md)

# 037 — Application routing and boundaries

[Persian](./037_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A production router maps URLs to nested UI and coordinates data loading, pending states, errors, and navigation. Route-level code splitting avoids downloading every feature at startup. Parallel loading can remove a parent-then-child request waterfall, but speculative prefetching still consumes bandwidth.

Separate authentication checks, resource authorization, and presentation. A route guard improves navigation experience but the server must authorize data and actions. Keep route params validated and use the URL for shareable filters. On navigation update the title, restore or intentionally reset scroll, and move focus where appropriate. Unknown routes and expired sessions require deliberate experiences.

## Common mistakes

Do not redirect every 403 to login or lose the intended destination after a successful sign-in. Avoid unvalidated return URLs.

## Exercise and acceptance criteria

Sketch nested routes for a dashboard, task detail, not-found page, and settings. Define each route’s loading and error boundary.

## Solution guidance

Keep stable navigation outside replaceable content. Validate ids, provide local errors, and allow safe return to a previous list state.

## Related code

- [index.html](../examples/../projects/001_accessible_catalog/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://reactrouter.com/start/framework/routing)

[Previous](../036_Server_State_Forms_and_Data/036_Lesson_English.md) · [Next](../038_SSR_SSG_Nextjs_and_RSC/038_Lesson_English.md)

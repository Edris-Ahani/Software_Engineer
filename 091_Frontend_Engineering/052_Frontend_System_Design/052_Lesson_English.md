# 052 — Frontend system design

[Persian](./052_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Begin a system design with users, workflows, scale, device and network constraints, and measurable nonfunctional requirements. Identify data ownership, API contracts, rendering strategy, state lifetimes, caching, accessibility, failure recovery, deployment, and observability. Draw the critical path from user intent to confirmed result.

Microfrontends can support independent team delivery, but introduce runtime integration, duplicate dependencies, routing, authentication, design consistency, and coordinated recovery problems. Use them when organizational boundaries justify the cost. A backend-for-frontend can tailor API composition and keep secrets server-side, but adds an operational service. Discuss tradeoffs using concrete scenarios, not architecture names alone.

## Common mistakes

Do not start with global state or microfrontends before establishing requirements. An architecture diagram without failure paths is incomplete.

## Exercise and acceptance criteria

Design an international marketplace for slow mobile devices with searchable catalog, cart, authenticated checkout, and live inventory.

## Solution guidance

Separate public cacheable catalog from private checkout, use stable operation ids for mutations, define stale inventory handling, and budget interaction and startup costs.

## Official reference

[Primary documentation](https://web.dev/learn/performance)

[Previous](../051_Frontend_Architecture/051_Lesson_English.md) · [Next](../053_Large_Data_Tables_and_Visualization/053_Lesson_English.md)

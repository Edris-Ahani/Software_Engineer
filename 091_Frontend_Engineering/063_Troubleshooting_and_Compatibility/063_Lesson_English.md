# 063 — Troubleshooting and compatibility

[Persian](./063_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Diagnose by layer. A command not found points to installation or PATH; an npm failure may involve connectivity, permissions, registry policy, or a lock mismatch. Browser module errors can come from file URLs, MIME types, missing files, or cross-origin rules. Use the supplied local HTTP server instead of disabling browser security.

For blank screens inspect Console, Network, and the first failed module. For stale UI inspect state ownership, mutated references, effect dependencies, and caches. For layout issues inspect computed size, overflow, and stacking contexts. Check actual feature support for target browsers; syntax transforms do not supply every missing API. Reduced test cases make compatibility reports actionable.

## Common mistakes

Clearing all caches can hide the cause of a rollout bug. Do not reinstall everything before recording the original error and versions.

## Exercise and acceptance criteria

Create a troubleshooting note for a missing module, malformed stored data, blocked request, and layout overflow, with one confirming check each.

## Solution guidance

Record the exact failing URL or operation, inspect its layer, reproduce minimally, apply one fix, and rerun the original user journey.

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Solve_CSS_problems)

[Previous](../062_Interview_Code_Review_and_Assessment/062_Lesson_English.md) · [Next](../064_Glossary_and_Continued_Learning/064_Lesson_English.md)

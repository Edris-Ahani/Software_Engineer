# 031 — Browser, end-to-end, and visual testing

[Persian](./031_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

End-to-end tests run a user journey in a real browser, covering navigation, interactions, and integration. Locate controls by role and accessible name; this couples the test to what the user can operate. Prefer auto-waiting assertions over arbitrary sleeps. Keep fixtures isolated so parallel tests do not share accidental state.

Use a few high-value flows such as search, task creation, and recovery after reload. Component tests narrow UI failures; visual comparison catches layout regressions but needs controlled fonts, viewport, data, and animation. Run different browser engines for meaningful compatibility risks. Automated accessibility scans complement but do not replace manual keyboard and screen-reader checks.

## Common mistakes

A test passing only after a long fixed sleep is still flaky. Do not point destructive E2E flows at production accounts.

## Exercise and acceptance criteria

Run the supplied optional Playwright search and persistence checks. Repeat at a narrow viewport and inspect the assertion failure output.

## Solution guidance

The test owns a temporary loopback server and closes it. It checks user-visible results after submission and after reload, with no fixed sleep.

## Related code

- [course.spec.mjs](../examples/../tests/browser/course.spec.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://playwright.dev/docs/intro)

[Previous](../030_Unit_and_Integration_Testing/030_Lesson_English.md) · [Next](../032_React_Components_and_Rendering/032_Lesson_English.md)

# 030 — Unit and integration testing

[Persian](./030_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A useful test protects an observable contract. Unit tests isolate pure rules such as a cart total or state transition; integration tests exercise collaborating pieces such as storage validation and rendering. Prefer inputs and outcomes over assertions about private implementation details.

Test boundaries and failures: empty collections, invalid values, duplicates, cancellation, overflow, and persistence failure. Inject time, randomness, or network adapters when nondeterminism matters. Mock only the boundary necessary for control; excessive mocking can prove that mocks agree with each other. Coverage indicates executed code, not the quality of assertions. A test that passed before a fix did not demonstrate that regression.

## Common mistakes

Do not test only the happy path or snapshot a whole page when a focused behavioral assertion would be clearer.

## Exercise and acceptance criteria

Add a regression test proving an invalid task update leaves the original list unchanged. Add a test for malformed persisted state.

## Solution guidance

Assert the thrown or tagged failure and the unchanged input. Use independent expected values rather than calling the implementation to calculate expectations.

## Related code

- [core.test.mjs](../examples/../tests/core.test.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://nodejs.org/api/test.html)

[Previous](../029_Debugging_and_DevTools/029_Lesson_English.md) · [Next](../031_Browser_E2E_and_Visual_Testing/031_Lesson_English.md)

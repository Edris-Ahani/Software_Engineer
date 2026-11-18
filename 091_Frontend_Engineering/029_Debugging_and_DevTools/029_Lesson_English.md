# 029 — Debugging and DevTools

[Persian](./029_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Debugging starts with a reproducible symptom, expected behavior, and the smallest failing input. Use breakpoints, conditional breakpoints, call stacks, and scope inspection to follow values. A source map connects generated code to authored files; incorrect release mapping can send you to the wrong source.

Network tools reveal initiators, timing, headers, and payloads. Performance traces explain blocking tasks and rendering work. Heap snapshots and allocation sampling help investigate retained objects, but compare equivalent states and allow garbage collection. Change one hypothesis at a time and keep a regression check for the root cause. Logging should be temporary or intentional and should never expose credentials.

## Common mistakes

Repeatedly adding logs without a hypothesis can obscure an ordering bug. Browser extensions can change behavior; reproduce in a clean profile.

## Exercise and acceptance criteria

Investigate a double event listener or outdated search result. Write reproduction steps and identify the owner of the duplicate or stale work.

## Solution guidance

Break at registration and response application, compare call stacks, add cleanup or ownership checks, and replay the same sequence.

## Related code

- [009_fetch.html](../examples/009_fetch.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.chrome.com/docs/devtools/javascript/)

[Previous](../028_Packages_Build_Tools_and_Linting/028_Lesson_English.md) · [Next](../030_Unit_and_Integration_Testing/030_Lesson_English.md)

# 022 — DOM events and lifecycle

[Persian](./022_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

The DOM is a live tree that JavaScript can query and update. Use textContent for plain text and construct elements for structured output. Query the smallest relevant subtree. Replacing a subtree can discard focus, input selection, and event listeners, so preserve identity when interaction depends on it.

Events travel through capture and bubbling phases. Delegation attaches a listener to a stable ancestor and locates a matching descendant with closest. Verify containment and the element type. preventDefault stops the browser's default action; stopPropagation stops further propagation and can break unrelated handlers. Every component needs cleanup for listeners, timers, observers, and pending work.

## Common mistakes

A detached node can remain in memory through a retained listener or closure. innerHTML with untrusted input creates an injection boundary.

## Exercise and acceptance criteria

Implement an increment button and add list items through a form. Keep existing controls focused while updating a count.

## Solution guidance

Update only the count text, append new list nodes, and attach one delegated listener if each item needs actions. Provide a dispose function.

## Related code

- [008_dom_events.html](../examples/008_dom_events.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)

[Previous](../021_Async_Event_Loop_and_Cancellation/021_Lesson_English.md) · [Next](../023_Fetch_APIs_and_Resilience/023_Lesson_English.md)

# 047 — Advanced accessibility

[Persian](./047_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Complex widgets require a documented interaction model. A modal dialog manages initial focus, contained tab navigation, Escape behavior, labeling, and restoration to its trigger. Prefer the native dialog element when suitable, then verify actual browser and assistive-technology behavior. A menu, tablist, and listbox have different keyboard contracts.

Virtualized collections can remove content from the accessibility tree and disrupt navigation. Preserve meaningful structure, announce counts carefully, and provide alternative access when needed. WCAG conformance involves applicable criteria across entire pages and complete processes. Automated checks cannot certify conformance; include task-based manual testing and disabled users' feedback where possible.

## Common mistakes

Do not add role="menu" to ordinary site navigation. Focus should not disappear after deleting the focused item.

## Exercise and acceptance criteria

Review a delete-confirmation dialog and task list with keyboard and a screen reader. Test cancellation, confirmation, and returning focus.

## Solution guidance

Restore focus to the trigger on cancellation and to a logical remaining control on deletion. Announce completion without stealing focus.

## Related code

- [index.html](../examples/../projects/002_persistent_board/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://www.w3.org/WAI/ARIA/apg/patterns/)

[Previous](../046_Realtime_SSE_WebSocket_and_WebRTC/046_Lesson_English.md) · [Next](../048_Internationalization_and_RTL/048_Lesson_English.md)

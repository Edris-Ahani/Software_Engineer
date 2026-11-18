# 009 — Accessibility foundations

[Persian](./009_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Accessibility means people can perceive, operate, understand, and reliably use a product. It includes keyboard access, sufficient contrast, readable content, meaningful labels, and compatible semantics. A screen reader consumes an accessibility tree derived from DOM semantics, visibility, and naming rules; visual appearance alone does not establish usability.

Use native elements first and preserve visible focus. Check reading order against DOM order, especially when CSS reorders a layout. Color must not be the sole error signal. Announce asynchronous results with a restrained status region; do not make the entire page live. Automated audits find some issues, while keyboard and screen-reader task testing reveal others.

## Common mistakes

ARIA does not implement keyboard behavior. aria-label can override useful visible text and create confusing names.

## Exercise and acceptance criteria

Complete a search and add-to-cart flow without a mouse at 200% zoom. Record missing labels, hidden focus, and reading-order problems.

## Solution guidance

Fix native semantics before adding ARIA. Retest the task and keep a manual accessibility checklist with the change.

## Related code

- [001_semantic_form.html](../examples/001_semantic_form.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://www.w3.org/WAI/tutorials/)

[Previous](../008_Images_Media_and_SVG/008_Lesson_English.md) · [Next](../010_CSS_Cascade_and_Selectors/010_Lesson_English.md)

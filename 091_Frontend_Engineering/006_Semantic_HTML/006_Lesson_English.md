# 006 — Semantic HTML

[Persian](./006_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

HTML describes meaning before appearance. Use main for the primary content, nav for navigation, article for independently meaningful content, and a heading hierarchy that reflects the document. A link changes location; a button performs an action. Native controls bring keyboard behavior and accessibility semantics that a clickable div lacks.

Attributes have different jobs: id identifies one element; class groups styling hooks; data-* carries application metadata. Escape untrusted text through textContent or framework text interpolation. Start with a valid document containing doctype, lang, charset, title, and viewport. Semantic HTML also makes testing by accessible role possible and improves resilience when CSS fails.

## Common mistakes

Do not choose headings for their default size, nest interactive controls, or replace native buttons with div elements.

## Exercise and acceptance criteria

Build a product article with a title, price, details link, and add button. Navigate using only Tab, Shift+Tab, and Enter.

## Solution guidance

The link has a real href and the button has type="button". The page contains one primary main landmark and ordered headings.

## Related code

- [001_semantic_form.html](../examples/001_semantic_form.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content)

[Previous](../005_Browser_Rendering/005_Lesson_English.md) · [Next](../007_Forms_and_Validation/007_Lesson_English.md)

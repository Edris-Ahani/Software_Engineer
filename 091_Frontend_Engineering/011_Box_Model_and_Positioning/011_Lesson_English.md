# 011 — Box model, flow, and positioning

[Persian](./011_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A box has content, padding, border, and margin. With border-box, the declared width includes padding and border, making responsive sizing easier to reason about. Normal flow places blocks and inline content; overflow and min-content sizing explain many apparent width bugs.

Relative positioning keeps the original space; absolute positioning removes the element from normal flow and uses a containing block. Fixed and sticky solve different problems: sticky depends on scroll containers and available movement space. z-index operates inside stacking contexts, which transforms, opacity, and other properties may create. A huge z-index cannot escape an ancestor stacking context.

## Common mistakes

Using absolute positioning for a whole page breaks when content grows. Sticky can fail because an ancestor creates an unexpected scroll container.

## Exercise and acceptance criteria

Build a card with a badge, a sticky page heading, and a long unbroken identifier. Prevent horizontal overflow without clipping focus.

## Solution guidance

Use normal flow for content, relative positioning on the badge container, overflow-wrap for text, and inspect stacking contexts for overlays.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)

[Previous](../010_CSS_Cascade_and_Selectors/010_Lesson_English.md) · [Next](../012_Flexbox_and_Grid/012_Lesson_English.md)

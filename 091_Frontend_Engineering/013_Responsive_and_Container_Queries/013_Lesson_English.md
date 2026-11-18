# 013 — Responsive design and container queries

[Persian](./013_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Responsive design adapts to available space, input methods, text scaling, and content. Start with a narrow useful layout and add complexity when the content needs it. A device list is not a breakpoint strategy; long translations and split-screen windows also change available space.

Media queries react to viewport or environmental conditions. Container queries allow a component to adapt to its own container; define containment intentionally and check browser support for the specific feature. Use fluid sizes with clamp while keeping readable minimums. Test touch targets, landscape, reduced motion, zoom, and real content. Feature queries and progressive fallback prevent newer CSS from removing essential access.

## Common mistakes

Do not disable pinch zoom. A responsive screenshot alone does not prove that controls remain usable with keyboard or enlarged text.

## Exercise and acceptance criteria

Place the same product card in a sidebar and a main region. Adapt its layout by container width without viewport-specific duplication.

## Solution guidance

Set container-type on the wrapper and query its inline size. Keep a one-column fallback before the container query.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)

[Previous](../012_Flexbox_and_Grid/012_Lesson_English.md) · [Next](../014_Typography_Color_and_Design/014_Lesson_English.md)

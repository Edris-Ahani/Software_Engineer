# 012 — Flexbox and Grid

[Persian](./012_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Flexbox distributes items along a main axis and aligns them along a cross axis. It fits toolbars and content-driven rows. Grid defines rows and columns together, making page layouts and repeated card collections easier. They can be nested: a grid page may contain flex navigation.

The default minimum size of a flex or grid item can preserve long content and cause overflow. Use min-inline-size: 0 when shrinking is intended. Flexible grid tracks such as minmax(0, 1fr) avoid an implicit content minimum. auto-fit with minmax supports adaptive cards, while explicit breakpoints remain useful when the information hierarchy changes.

## Common mistakes

Visual order is not keyboard or reading order. Avoid rearranging interactive content into a different logical sequence.

## Exercise and acceptance criteria

Create a sidebar layout and a responsive card grid. Test at 320px, 768px, and 1440px with one very long product name.

## Solution guidance

Start with one column, introduce the sidebar when content fits, and let the card collection choose its columns using a safe minmax minimum.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout)

[Previous](../011_Box_Model_and_Positioning/011_Lesson_English.md) · [Next](../013_Responsive_and_Container_Queries/013_Lesson_English.md)

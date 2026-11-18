# 005 — Browser rendering and runtime

[Persian](./005_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

HTML parsing creates the DOM; CSS contributes style information. Style calculation, layout, paint, and compositing turn these structures into pixels. A geometry change can require layout; an opacity or transform animation may avoid it, but compositing is an implementation decision, not a guarantee.

JavaScript and rendering compete for main-thread time. A long synchronous task delays input and painting even when the network is fast. Reading layout immediately after writing styles can force synchronous layout. Group reads before writes, reduce affected DOM size, and measure with a performance trace. requestAnimationFrame schedules work before a rendering opportunity; it does not make expensive computation cheap.

## Common mistakes

Adding will-change to every element consumes resources and can worsen performance. Microtasks do not guarantee a paint between updates.

## Exercise and acceptance criteria

Record resizing a grid, then compare a top-position animation with a transform animation. Identify layout and paint events.

## Solution guidance

Use the same content, device throttling, and duration. Explain trace differences rather than assuming transform is always faster.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)
- [020_motion.html](../examples/020_motion.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work)

[Previous](../004_Internet_HTTP_and_DNS/004_Lesson_English.md) · [Next](../006_Semantic_HTML/006_Lesson_English.md)

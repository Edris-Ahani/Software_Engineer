# 015 — CSS architecture and motion

[Persian](./015_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

CSS organization should make ownership and overrides predictable. BEM uses naming conventions, CSS Modules scope class names through tooling, and utility classes compose small rules. Each is viable; mixing them without boundaries creates duplicate styling systems. Keep global resets and tokens separate from component rules.

Transitions interpolate a property between states; keyframes define a sequence. Animate to explain state changes, avoid motion required for comprehension, and respect prefers-reduced-motion. Favor transform and opacity where they express the design, then measure. Modern nesting and selectors such as :has can reduce glue code, but check support and keep selectors understandable.

## Common mistakes

Avoid a global selector that changes every button in a third-party widget. Do not keep invisible animated elements focusable.

## Exercise and acceptance criteria

Create opening and closing states for a disclosure. Add a reduced-motion rule and document which component owns each selector.

## Solution guidance

Use native details/summary where sufficient. Keep the expanded state correct even if transitions are disabled, and remove unnecessary motion.

## Related code

- [020_motion.html](../examples/020_motion.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Animations)

[Previous](../014_Typography_Color_and_Design/014_Lesson_English.md) · [Next](../016_JavaScript_Fundamentals/016_Lesson_English.md)

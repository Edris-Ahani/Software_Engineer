# 010 — CSS cascade and selectors

[Persian](./010_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

CSS resolves competing declarations using origin, importance, cascade layers, specificity, scoping proximity where applicable, and source order. Inheritance is separate: some properties inherit from parents, while others use initial values. A more specific selector does not always win across origins or layers.

Prefer low-specificity class selectors and deliberate layers for reset, base, components, and utilities. Custom properties participate in the cascade and can express design tokens such as spacing and colors. Inspect the computed style and crossed-out declarations in DevTools before adding overrides. Understand pseudo-classes such as :focus-visible and pseudo-elements such as ::before; generated content should not carry essential instructions.

## Common mistakes

Repeated !important usually hides an ownership or layering problem. CSS variables are resolved at use sites, not like copied constants.

## Exercise and acceptance criteria

Place two conflicting button rules in different layers. Predict the winner, then confirm the computed background and explain why.

## Solution guidance

For normal declarations, later layers win over earlier ones regardless of selector specificity; important layer ordering is reversed.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction)

[Previous](../009_Accessibility_Foundations/009_Lesson_English.md) · [Next](../011_Box_Model_and_Positioning/011_Lesson_English.md)

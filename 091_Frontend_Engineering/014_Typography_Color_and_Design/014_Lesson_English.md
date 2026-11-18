# 014 — Typography, color, and visual design

[Persian](./014_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Visual hierarchy communicates what matters through spacing, scale, weight, and grouping. Use a consistent spacing scale and semantic color tokens instead of unrelated values. Comfortable line length and line height matter more than copying a fashionable font size.

Web fonts add network and rendering costs. Use licensed assets, subset only when the required writing systems remain supported, and choose fallbacks with similar metrics. font-display affects how text appears during loading; it does not remove layout-shift risk. Specify contrast for normal, hover, focus, disabled, and error states. Dark mode is a separate set of contrast relationships, not simply inverted colors.

## Common mistakes

Do not encode meaning only in red and green. Font subsets that omit Persian shaping or digits can produce broken mixed-script text.

## Exercise and acceptance criteria

Define tokens for background, text, action, danger, spacing, and radius. Use them in both light and dark card designs.

## Solution guidance

Choose semantic names such as --color-danger, verify contrast for actual foreground/background pairs, and test fallback fonts before loading completes.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Text_styling)

[Previous](../013_Responsive_and_Container_Queries/013_Lesson_English.md) · [Next](../015_CSS_Architecture_and_Motion/015_Lesson_English.md)

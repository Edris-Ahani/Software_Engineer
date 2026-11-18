# 008 — Images, media, and SVG

[Persian](./008_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Images need intrinsic dimensions to reserve layout space. Use srcset and sizes when the browser should choose a resolution; use picture for art direction or format alternatives. Compress deliberately and compare visual quality at the rendered size. Lazy-load below-the-fold media, but avoid delaying the likely largest visible image.

Alternative text communicates an image's purpose in context. Decorative images use empty alt; charts need a textual explanation and data access. SVG remains sharp at multiple sizes and suits icons; raster formats suit photographs. Video needs captions and often a transcript; autoplaying sound is disruptive. Treat uploaded SVG or HTML as active content and sanitize or isolate it rather than inserting untrusted markup.

## Common mistakes

A huge image displayed small still costs transfer and decode time. An icon-only button still needs an accessible name.

## Exercise and acceptance criteria

Add a responsive product image and a decorative SVG. Disable images and explain whether the purchase task remains understandable.

## Solution guidance

Reserve width and height, provide meaningful alt for the product, and hide decorative SVG from assistive technology.

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images)

[Previous](../007_Forms_and_Validation/007_Lesson_English.md) · [Next](../009_Accessibility_Foundations/009_Lesson_English.md)

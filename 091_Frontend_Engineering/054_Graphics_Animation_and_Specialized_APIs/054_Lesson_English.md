# 054 — Graphics, animation, and specialized APIs

[Persian](./054_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

SVG exposes vector shapes in the DOM; canvas draws pixels through an imperative API; WebGL and WebGPU support GPU-oriented rendering with different capabilities and compatibility requirements. Choose from object count, interaction, accessibility, and device constraints. A canvas image does not automatically expose each drawn item to assistive technology.

Animation should use elapsed time rather than assuming a fixed frame rate. Respect reduced motion, pause unnecessary work when hidden, and scale the drawing buffer appropriately for device pixel ratio without allocating unbounded memory. Specialized APIs such as geolocation, clipboard, camera, and notifications have permission, secure-context, and user-activation requirements. Always offer a useful denied-permission path.

## Common mistakes

Do not request camera or notification access before explaining its purpose. More pixels and more GPU layers can hurt low-memory devices.

## Exercise and acceptance criteria

Run the canvas chart with its equivalent HTML table. Resize it and explain how you would handle high-density screens and reduced motion.

## Solution guidance

Keep the table as the authoritative readable data, bound the drawing resolution, and provide text descriptions for information encoded visually.

## Related code

- [017_canvas.html](../examples/017_canvas.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

[Previous](../053_Large_Data_Tables_and_Visualization/053_Lesson_English.md) · [Next](../055_CI_CD_and_Deployment/055_Lesson_English.md)

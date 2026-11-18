# 042 — Performance and Core Web Vitals

[Persian](./042_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Performance is an observed user outcome. LCP measures loading of the largest eligible visible content, INP measures responsiveness across interactions, and CLS measures unexpected layout shifts. Good thresholds at the 75th percentile are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1. Segment field data by device, route, and release rather than averaging away slow users.

Lab traces help diagnose; field measurements capture real conditions. Start with a budget for JavaScript, critical images, fonts, and interaction work. Reduce unnecessary requests and execution, reserve media space, and prioritize the actual LCP resource. Splitting code helps startup only if it does not create a new critical waterfall. Re-measure after each change.

## Common mistakes

A high Lighthouse score on a developer laptop is not proof of a fast production experience. FPS alone misses input delay.

## Exercise and acceptance criteria

Profile the catalog under CPU and network throttling. Identify the LCP element and one interaction task, then propose a measurable improvement.

## Solution guidance

Record a baseline, change one cause such as image delivery or excessive DOM work, and compare repeated runs with identical conditions.

## Related code

- [002_responsive_layout.html](../examples/002_responsive_layout.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://web.dev/articles/vitals)

[Previous](../041_Authentication_and_Sessions/041_Lesson_English.md) · [Next](../043_Caching_CDN_and_Delivery/043_Lesson_English.md)

# 039 — Frameworks and Web Components

[Persian](./039_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

React describes UI with components and state; Vue combines templates with reactivity and single-file components; Angular offers an integrated framework with dependency injection, templates, routing, and reactive primitives; Svelte compiles components and provides reactive language features. These approaches share component ownership and lifecycle problems even when syntax differs.

Choose using team capability, ecosystem, deployment constraints, accessibility needs, and migration cost. Web Components use custom elements and optionally Shadow DOM to define browser-native component boundaries. Shadow DOM isolates parts of styling but does not create a security boundary. Cross-framework elements still need clear property, attribute, event, focus, and form contracts.

## Common mistakes

Do not compare frameworks using hello-world bundle size alone. Avoid choosing microfrontends just to allow every team a different framework.

## Exercise and acceptance criteria

Implement a tiny counter as a custom element and define how a host reads its value and observes change events.

## Solution guidance

Register once, create accessible native controls, dispatch a documented CustomEvent, and clean up on disconnection. Compare the same contract in another framework.

## Related code

- [014_custom_element.html](../examples/014_custom_element.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

[Vue](https://vuejs.org/guide/introduction.html) · [Angular](https://angular.dev/overview) · [Svelte](https://svelte.dev/docs/svelte/overview)

[Previous](../038_SSR_SSG_Nextjs_and_RSC/038_Lesson_English.md) · [Next](../040_Frontend_Security/040_Lesson_English.md)

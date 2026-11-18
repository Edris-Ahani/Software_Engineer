# 032 — React components and rendering

[Persian](./032_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A React component is a function describing UI for its props and state. JSX expresses that description; it is not an HTML string. Rendering should be pure: do not mutate external state, subscribe, or fetch during an ordinary client render. React may render again before committing changes.

Props flow from parents to children; events communicate requested changes upward. Composition through children or focused components avoids giant configuration objects. Stable keys identify siblings across insertions and reordering; an array index is unsafe when item identity moves. A component's state is associated with its position and identity in the tree, so changing a key can deliberately reset it.

## Common mistakes

Do not call components as ordinary functions or define component types inside another component when stable identity is required.

## Exercise and acceptance criteria

Split the supplied React dashboard into filter form, task list, and status components with explicit typed props.

## Solution guidance

Keep the collection owner in one parent, pass values and callbacks, and use task ids as keys. Verify reordering preserves item identity.

## Related code

- [main.tsx](../examples/../projects/003_react_dashboard/src/main.tsx)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/learn/describing-the-ui)

[Previous](../031_Browser_E2E_and_Visual_Testing/031_Lesson_English.md) · [Next](../033_React_State_and_Reducers/033_Lesson_English.md)

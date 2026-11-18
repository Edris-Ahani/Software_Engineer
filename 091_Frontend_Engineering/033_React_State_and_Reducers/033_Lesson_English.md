# 033 — React state and reducers

[Persian](./033_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

State is a snapshot for a render. Setting it requests another render; it does not rewrite the value captured by the current handler. Functional updates are useful when the next value depends on the previous one. React can batch updates, so repeated setters with the same captured value may collapse into one outcome.

Store the minimal source of truth and derive counts and filtered lists during rendering. Lift state to the nearest common owner rather than duplicating it in siblings. A reducer centralizes related transitions and makes invariants testable. Context distributes a value through a subtree; it is not automatically a selective high-performance state store.

## Common mistakes

Mutating an array and returning the same reference can hide a change. Derived state stored separately can drift from the original.

## Exercise and acceptance criteria

Implement add and toggle actions with a pure reducer. Reject blank titles and duplicate ids; derive the completed count.

## Solution guidance

Validate before constructing a new array, copy only changed items, and keep invalid actions from altering existing state.

## Related code

- [tasks.mjs](../examples/../lib/tasks.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://react.dev/learn/extracting-state-logic-into-a-reducer)

[Previous](../032_React_Components_and_Rendering/032_Lesson_English.md) · [Next](../034_Effects_Refs_and_Cleanup/034_Lesson_English.md)

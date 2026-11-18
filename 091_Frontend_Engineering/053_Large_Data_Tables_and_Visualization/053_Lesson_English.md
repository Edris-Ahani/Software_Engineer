# 053 — Large data tables and visualization

[Persian](./053_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Complex data interfaces combine filtering, sorting, pagination, selection, editing, and accessibility. Decide which operations belong on the server and which can run locally. Cursor pagination avoids some offset drift, but requires a stable ordering contract and cannot provide arbitrary page jumps without additional support.

Virtualization limits mounted rows and improves rendering cost, while variable heights, sticky headers, keyboard navigation, and screen-reader access complicate implementation. Keep selection keyed by stable ids and define whether select-all means visible page or all matching records. Charts need labeled axes, meaningful units, accessible summaries, and a table or equivalent way to inspect values.

## Common mistakes

Do not sort only the visible page when the UI promises global sorting. A million cached rows can exhaust memory even with virtualization.

## Exercise and acceptance criteria

Design selection across pages and a chart with a data-table alternative. Test empty, partial, loading, and out-of-order page responses.

## Solution guidance

Store selected ids independently from rendered rows, include sorting in the query key, and keep the textual data synchronized with the graphic.

## Related code

- [017_canvas.html](../examples/017_canvas.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://www.w3.org/WAI/tutorials/tables/)

[Previous](../052_Frontend_System_Design/052_Lesson_English.md) · [Next](../054_Graphics_Animation_and_Specialized_APIs/054_Lesson_English.md)

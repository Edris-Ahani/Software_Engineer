# 059 — Project 1: accessible catalog

[Persian](./059_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Build a useful page before introducing a framework. The reference catalog combines semantic landmarks, a search form, a responsive grid, a visible result count, URL-backed filters, and safe text rendering. Data is local so the exercise isolates browser and UI fundamentals.

Work in increments: structure first, then layout, filtering, keyboard feedback, and edge cases. Search should be case-insensitive and survive reload through the q parameter. A missing result is an empty state, not an error. Treat the reference as a starting point: it does not implement inventory, payments, remote images, or server search.

## Common mistakes

Do not replace the entire form on each search or move focus unexpectedly when results update.

## Exercise and acceptance criteria

Run project 001, search for keyboard, reload, use back/forward, and test a query with no matches at 320px width.

## Solution guidance

Keep the form stable, render results into a dedicated list, restore state on popstate, and announce a concise result count.

## Related code

- [index.html](../examples/../projects/001_accessible_catalog/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core)

[Previous](../058_Senior_Engineering_and_Collaboration/058_Lesson_English.md) · [Next](../060_Project_Persistent_Task_Board/060_Lesson_English.md)

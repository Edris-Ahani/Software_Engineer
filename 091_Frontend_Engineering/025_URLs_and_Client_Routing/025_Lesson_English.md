# 025 — URLs and client-side routing

[Persian](./025_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A URL is durable application state: filters, sort order, and page position often belong in search parameters so a view can be shared and restored. Use URL and URLSearchParams instead of concatenating unescaped strings. Fragments identify in-page targets and can support a simple static hash router.

History.pushState changes a URL without navigation; back and forward produce popstate events. A path-based SPA also needs server fallback for valid application routes, while missing assets should remain real 404s. Routing must handle focus, titles, pending states, and unknown routes. Avoid intercepting modified clicks, download links, or external navigation.

## Common mistakes

Do not put secrets or personal data in URLs: they can appear in history, logs, analytics, and referrers.

## Exercise and acceptance criteria

Synchronize a product search field with the q parameter. Reload, copy the link, and navigate backward through two submitted searches.

## Solution guidance

Read initial state from the URL, push a new entry on a meaningful submission, and restore the form and results on popstate.

## Related code

- [index.html](../examples/../projects/001_accessible_catalog/index.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/History_API)

[Previous](../024_Storage_and_IndexedDB/024_Lesson_English.md) · [Next](../026_TypeScript_Fundamentals/026_Lesson_English.md)

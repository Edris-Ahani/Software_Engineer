# 045 — Progressive web apps and offline behavior

[Persian](./045_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A service worker is an event-driven network intermediary with an installation, waiting, activation, and update lifecycle. It requires a secure context, with localhost treated specially for development. A web app manifest provides metadata; installability and capabilities vary by browser. Offline behavior must be designed rather than assumed from a manifest.

Use cache-first for versioned static assets, network-first for some freshness-sensitive documents, and explicit rules for private data. Do not cache every request indiscriminately. Offline mutations need a durable queue, operation ids, retry budgets, and conflict reconciliation when connectivity returns. navigator.onLine is a hint, not proof that your API is reachable.

## Common mistakes

Forcing immediate activation can break an open page using old assets. Clear user-specific offline data on logout and respect storage limits.

## Exercise and acceptance criteria

Cache only the supplied offline demo document. Load once online, reload offline, then unregister the worker and clear its named cache.

## Solution guidance

Use a dedicated worker scope and a versioned cache name. Explain first-visit limitations and distinguish browser HTTP cache from worker cache.

## Related code

- [index.html](../examples/015_offline/index.html)
- [016_service_worker.js](../examples/015_offline/016_service_worker.js)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

[Previous](../044_Workers_Streams_and_WASM/044_Lesson_English.md) · [Next](../046_Realtime_SSE_WebSocket_and_WebRTC/046_Lesson_English.md)

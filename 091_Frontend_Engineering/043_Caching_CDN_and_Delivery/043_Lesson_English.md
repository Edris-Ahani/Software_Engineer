# 043 — Caching, CDN, and delivery

[Persian](./043_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Browser caches and CDN caches have different scopes. Cache-Control governs freshness and sharing; ETag enables conditional validation. no-cache permits storage but requires validation before reuse; no-store requests no storage. Content-hashed immutable assets can have long lifetimes, while the HTML that references them needs a compatible update strategy.

A public cache key must include every representation dimension that matters. Vary can select by headers, but excessive variants reduce hit rate. Personalized content requires explicit private handling and protection against cross-user leakage. Compression reduces transfer, not parse cost. Preload only truly critical resources, and use preconnect selectively because unused connections consume resources.

## Common mistakes

Never cache authenticated HTML publicly by accident. A service-worker cache is an additional layer and is not automatically governed by HTTP freshness logic.

## Exercise and acceptance criteria

Write a delivery policy for index.html, hashed JavaScript, user profile JSON, and a public product list. Explain deployment rollback.

## Solution guidance

Keep hashed assets available across releases, update HTML atomically, validate public data as required, and prevent shared caching of private responses.

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)

[Previous](../042_Performance_and_Core_Web_Vitals/042_Lesson_English.md) · [Next](../044_Workers_Streams_and_WASM/044_Lesson_English.md)

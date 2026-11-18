# 049 — SEO and metadata

[Persian](./049_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Search discoverability depends on crawlable links, useful content, correct status codes, canonical URLs, metadata, and performance. Give each indexable route a descriptive title and meaningful document structure. robots.txt controls crawler access requests; it does not secure private content, and noindex has separate semantics.

Client rendering may delay content availability to crawlers. Server-rendered or prebuilt public content can improve predictability, while authenticated dashboards usually have little indexing value. Structured data must accurately describe visible content and follow the relevant vocabulary. Handle canonical filters, pagination, localized alternate links, redirects, and true not-found statuses intentionally.

## Common mistakes

A soft 404 returning 200 confuses monitoring and indexing. Canonical is a signal, not access control or a guaranteed indexing command.

## Exercise and acceptance criteria

Define metadata and status behavior for product detail, filtered catalog, removed product, and private account routes.

## Solution guidance

Use meaningful titles and canonical public URLs, a deliberate redirect or 404/410 for removed content, and real authentication for private data.

## Official reference

[Primary documentation](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

[Previous](../048_Internationalization_and_RTL/048_Lesson_English.md) · [Next](../050_Design_Systems_and_Component_APIs/050_Lesson_English.md)

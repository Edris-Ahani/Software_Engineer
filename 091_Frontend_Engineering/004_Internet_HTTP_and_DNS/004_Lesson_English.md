# 004 — Internet, DNS, and HTTP

[Persian](./004_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

A navigation may involve DNS lookup, a connection, TLS negotiation, an HTTP request, redirects, and subresource requests. HTTP/2 multiplexes streams over a connection; HTTP/3 uses QUIC. Latency and payload size matter independently, so reducing JavaScript bytes does not fix a slow origin response.

Read requests by method, URL, headers, and body. GET is intended for retrieval; POST commonly creates or triggers operations; PUT replaces a representation; PATCH applies partial changes. A status is part of the contract: 401 concerns authentication, 403 denial, 404 absence, and 429 rate limiting. An origin is scheme, host, and port. CORS controls which origins can read responses through browser APIs; it is not server authorization.

## Common mistakes

fetch resolves for HTTP 404; check response.ok. A successful preflight does not prove that a user may access a resource.

## Exercise and acceptance criteria

Inspect one document and one API request in Network. Record initiator, timings, status, cache headers, and transferred size.

## Solution guidance

Separate connection time, server wait, and download time. Reproduce with cache disabled and throttling before assigning a bottleneck.

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP)

[Previous](../003_Git_and_Workflow/003_Lesson_English.md) · [Next](../005_Browser_Rendering/005_Lesson_English.md)

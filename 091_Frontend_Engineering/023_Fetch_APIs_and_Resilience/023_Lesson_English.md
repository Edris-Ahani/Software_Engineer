# 023 — Fetch, API contracts, and resilience

[Persian](./023_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

An API client validates status, content, and schema before treating a response as domain data. Model loading, success, empty, failure, and cancellation separately. A timeout needs an abort signal; racing a timeout promise alone leaves the request running.

Retries require a bounded budget, backoff, and often jitter. Retry a transient idempotent read, not every failure; 400 and validation errors will not improve with repetition. Mutations need server-supported idempotency before automatic retry. REST exposes resources; GraphQL exposes a schema with selected fields and may return data together with errors even on HTTP 200. Pagination, authorization, and caching still require explicit contracts in either style.

## Common mistakes

Never display an abort caused by a new search as an alarming failure. A successful JSON parse does not validate the payload shape.

## Exercise and acceptance criteria

Create a JSON loader that rejects a 404 and invalid records. Simulate stale responses, cancellation, and a retryable 503.

## Solution guidance

Check response.ok, validate unknown input, enforce a timeout, and retry only explicitly allowed statuses within a small attempt limit.

## Related code

- [009_fetch.html](../examples/009_fetch.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

[Previous](../022_DOM_Events_and_Lifecycle/022_Lesson_English.md) · [Next](../024_Storage_and_IndexedDB/024_Lesson_English.md)

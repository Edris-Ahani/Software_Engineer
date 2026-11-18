# 044 — Workers, streams, and WebAssembly

[Persian](./044_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Web Workers run JavaScript outside the main thread and communicate through messages. They cannot directly access the DOM. Structured cloning copies supported data; transferable buffers move ownership and detach the sender's buffer. Moving a tiny operation to a worker can cost more than it saves, so consider serialization and startup.

ReadableStream supports incremental processing and backpressure rather than loading an entire response into memory. Respect cancellation and decoding boundaries between chunks. WebAssembly executes compiled modules and suits some compute-heavy or existing native-code workloads; it is not a universal replacement for DOM-driven JavaScript. Shared memory has additional isolation requirements and race risks.

## Common mistakes

A worker does not remove total CPU cost. Posting a huge object repeatedly can erase responsiveness gains.

## Exercise and acceptance criteria

Run the worker sum example while clicking another control. Compare with the same loop on the main thread and terminate the worker afterward.

## Solution guidance

Send a bounded input, validate it in the worker, return a request id with the result, and clean up when the owner is removed.

## Related code

- [012_worker.html](../examples/012_worker.html)
- [013_sum_worker.mjs](../examples/013_sum_worker.mjs)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

[Previous](../043_Caching_CDN_and_Delivery/043_Lesson_English.md) · [Next](../045_PWA_and_Offline/045_Lesson_English.md)

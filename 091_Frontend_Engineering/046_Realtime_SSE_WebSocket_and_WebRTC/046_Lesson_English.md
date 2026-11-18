# 046 — Realtime: SSE, WebSocket, and WebRTC

[Persian](./046_Lesson_Persian.md) · [Course path](../README_English.md) · [Execution guide](../RUNNING_English.md)

## Concept and mechanism

Polling makes repeated HTTP reads; SSE streams server-to-client text events and provides browser reconnection support; WebSocket supports bidirectional messages. WebRTC adds peer media and data channels with signaling and connectivity traversal. Choose from direction, latency, infrastructure, authentication, and recovery needs.

A live connection can drop, duplicate events, or fall behind. Assign event ids or versions, detect gaps, and resynchronize from a snapshot when needed. Bound buffers and batch display updates to avoid overwhelming the main thread. Reconnection needs backoff and jitter; a connection indicator should describe degraded freshness rather than falsely claiming that old data is current.

## Common mistakes

WebSocket is not automatically more reliable than HTTP. Native EventSource has authentication-header limitations; do not solve them by putting tokens in URLs.

## Exercise and acceptance criteria

Run the finite SSE demo, observe event ids, and close the source after the third event. Design how a missed event would be recovered.

## Solution guidance

Apply events by id or version, ignore duplicates, and fetch a fresh snapshot if the stream indicates a gap. Always dispose the connection.

## Related code

- [019_sse.html](../examples/019_sse.html)

[Inputs, expected outputs, and limitations](../examples/README_English.md)

## Official reference

[Primary documentation](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

[Previous](../045_PWA_and_Offline/045_Lesson_English.md) · [Next](../047_Advanced_Accessibility/047_Lesson_English.md)

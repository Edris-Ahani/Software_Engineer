# Server-Sent Events (SSE)

## What is it?
Server-Sent Events (SSE) is a web technology that allows a browser to receive automatic updates from a server via an HTTP connection. Unlike WebSockets, which provide full-duplex (two-way) communication, SSE is **unidirectional** (one-way: Server to Client).

## Why use SSE instead of WebSockets?
WebSockets are powerful, but they require a completely different protocol (ws://) and can be complex to load-balance and maintain. SSE works over standard HTTP/HTTPS.
- If you need to build a real-time multiplayer game or a chat application where the user is constantly sending data *back* to the server, use WebSockets.
- If you only need to push data *from* the server to the client (like a live news feed, a stock price ticker, or live sports scores), SSE is much simpler, lighter, and uses standard HTTP infrastructure.

## How it works
1. The client sends a standard HTTP GET request to the server, asking to subscribe to a stream.
2. The server responds with `Content-Type: text/event-stream` and keeps the connection open.
3. Whenever a new event happens on the backend, the server simply writes a new line of text to that open connection.
4. The browser automatically fires a JavaScript event whenever it receives a new message.

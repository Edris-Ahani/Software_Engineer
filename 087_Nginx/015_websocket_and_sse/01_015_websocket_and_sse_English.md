[← Contents and learning path](../README.md) | [فارسی](01_015_websocket_and_sse_Persian.md)

# 015 — WebSocket, SSE, and streaming responses

## Goal and prerequisites
Keep interactive connections alive and prevent unwanted response buffering. Prerequisites: reverse proxy, timeouts, and HTTP headers. This **HTTP-context fragment** needs a real WebSocket server on port 3000; the lab's Python backend implements SSE, not WebSocket.


```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    "" close;
}

server {
    listen 8088;
    location /ws/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_read_timeout 75s;
    }
    location /events/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 75s;
        gzip off;
    }
}
```

## WebSocket versus SSE
WebSocket normally upgrades HTTP/1.1 with a 101 response and then provides bidirectional frames. Upgrade and Connection are hop-by-hop headers and need deliberate proxy handling. A normal HTTP endpoint cannot become a WebSocket server merely by adding those headers.

SSE stays an HTTP response with `Content-Type: text/event-stream`. Events are UTF-8 lines such as `data: {...}` followed by a blank line. The server must flush events; proxies/CDNs can buffer too. Setting `proxy_buffering off` at one hop cannot force every outer hop to stream.

`proxy_read_timeout` measures idle time between upstream reads. A heartbeat interval below it prevents idle disconnection; it is not a maximum session duration. Clients need reconnection logic. SSE can use event IDs and Last-Event-ID when the application implements replay.


```bash
# Runnable SSE demonstration in the lab; events arrive over time:
curl -N -i http://localhost:8080/events/
# WebSocket requires a real backend and a protocol-aware client:
# Connect a browser WebSocket client to ws://127.0.0.1:8088/ws/
# Inspect 101 Switching Protocols in browser developer tools.
```

## Verification and failure cases
In the lab, expect three events separated in time and a clean end. A whole response arriving at once suggests buffering or missing flush. For WebSocket, inspect the handshake and then send an actual message: 101 alone does not test application behavior.

Long connections consume resources and complicate rolling reloads. Plan connection draining and client reconnects. Apply authentication, authorization and Origin checks in the application where appropriate; CORS rules for fetch are not a universal WebSocket access-control mechanism.

## Exercise and answer
Why does increasing a timeout fail to fix events delivered in batches? Because buffering and flushing are separate from idle expiry. Inspect the application flush and each proxy/CDN before changing timeouts.

## Official references

- [WebSocket proxying](https://nginx.org/en/docs/http/websocket.html)
- [Response buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_buffering)

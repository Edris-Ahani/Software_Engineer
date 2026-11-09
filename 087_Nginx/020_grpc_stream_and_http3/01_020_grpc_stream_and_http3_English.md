[← Contents and learning path](../README.md) | [فارسی](01_020_grpc_stream_and_http3_Persian.md)

# 020 — gRPC, TCP/UDP streams, HTTP/2, and HTTP/3

## Goal and prerequisites
Choose the correct protocol module and identify where TLS ends. Prerequisites: HTTP proxying, TLS, and build inspection. These are **separate conceptual fragments**, not a runnable all-in-one config. Install modules and provide actual certificates/backends before validation.

| Traffic | Facility | What Nginx understands |
| --- | --- | --- |
| HTTP API | `http` + `proxy_pass` | Paths, headers, status |
| gRPC | `http` + `grpc_pass` | HTTP/2-based gRPC transport |
| Generic TCP/UDP | `stream` + `proxy_pass` | Transport sessions, not HTTP routes |
| Browser HTTP/3 | HTTP/3/QUIC module | HTTP over QUIC/UDP |

An identically named directive in HTTP and stream does not imply identical context or behavior.


```nginx
# Inside http; requires HTTP/2, gRPC modules and certificate files.
server {
    listen 9443 ssl;
    http2 on;
    server_name grpc.example.com;
    ssl_certificate /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    location / {
        grpc_pass grpc://127.0.0.1:50051;
        grpc_read_timeout 60s;
    }
}
```

## gRPC checks
Use `grpc://` for cleartext upstream transport and `grpcs://` for TLS. For upstream TLS explicitly configure trust and hostname verification using gRPC SSL directives; the scheme alone does not provide that assurance. A curl GET is not a full gRPC test. Use a protocol-aware client with service definitions, or reflection if enabled. Application errors may appear in `grpc-status` trailers even with HTTP 200.


```nginx
# Main-level sibling of http, not nested inside it.
# Your package may require loading a stream module first.
stream {
    upstream database_pool { server 10.40.0.10:5432; }
    server {
        listen 127.0.0.1:15432;
        proxy_pass database_pool;
        proxy_connect_timeout 3s;
        proxy_timeout 60s;
    }
}
```

## Stream and HTTP/3
Stream cannot apply HTTP locations or inject HTTP headers into PostgreSQL. In TLS passthrough, the backend owns the handshake and certificate. Load modules according to your package; there is no universal `.so` path.

For HTTP/3 add a QUIC UDP listener and advertise Alt-Svc while retaining TCP HTTPS fallback. The next **server fragment** requires a compatible QUIC/TLS build and certificate configuration in the server or inherited by it. Check current HTTP/3 module support status before production use. `http2 on` requires Nginx 1.25.1 or newer.


```nginx
# Inside an already configured HTTPS server:
listen 443 quic reuseport;
# Keep the existing TCP listener: listen 443 ssl;
http2 on;
add_header Alt-Svc 'h3=":443"; ma=3600' always;
```

## Exercise and answer
HTTP/2 works but HTTP/3 times out: check UDP 443 publication/firewall, QUIC build support, Alt-Svc and client HTTP/3 support. A TCP check does not test UDP. The local lab teaches HTTP/1.1 and SSE and does not claim to test these optional protocols.

## Official references

- [gRPC module](https://nginx.org/en/docs/http/ngx_http_grpc_module.html)
- [Stream module](https://nginx.org/en/docs/stream/ngx_stream_core_module.html)
- [HTTP/3 support status](https://nginx.org/en/docs/http/ngx_http_v3_module.html)

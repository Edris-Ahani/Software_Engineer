[← Contents and learning path](../README.md) | [فارسی](01_010_upstreams_and_load_balancing_Persian.md)

# 010 — Upstreams, balancing, keepalive, and retries

## Goal and prerequisites
Distribute requests and reason about failure safely. Prerequisites: reverse proxy and logs. The following is an **HTTP-context fragment**. It needs two actual services on the stated loopback ports, or replace them with `app1:8000` and `app2:8000` in the lab network.


```nginx
upstream application_pool {
    zone application_pool 64k;
    least_conn;
    server 127.0.0.1:3001 max_fails=2 fail_timeout=10s;
    server 127.0.0.1:3002 max_fails=2 fail_timeout=10s;
    keepalive 16;
}

server {
    listen 8084;
    location / {
        proxy_pass http://application_pool;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_connect_timeout 2s;
        proxy_read_timeout 15s;
        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_next_upstream_tries 2;
    }
}
```

## Choose a policy

| Policy | Useful when | Caveat |
| --- | --- | --- |
| Default weighted round robin | Similar request costs | Does not guarantee an exact visible alternation |
| `least_conn` | Request durations differ | Connections are not application CPU utilization |
| `ip_hash` | Temporary IP affinity is required | NAT groups many users; changes can move sessions |
| `hash $key consistent` | Stable key mapping is useful | Requires a meaningful key and external state design |

A shared `zone` helps workers share upstream state. `keepalive 16` is an idle connection cache per worker, not a total connection cap. Clearing the Connection header and using HTTP/1.1 permits reuse. Keep sessions and durable state outside individual app processes when possible.


```bash
# From 087_Nginx, with the lab running:
python _lab/smoke_test.py
# Send requests one by one and inspect backend labels:
curl -s http://localhost:8080/api/hello
curl -s http://localhost:8080/api/hello
# Temporary failure experiment, then restore:
docker compose -f _lab/compose.yaml stop app1
curl -i http://localhost:8080/api/hello
docker compose -f _lab/compose.yaml start app1
```

## Failure and retry semantics
`max_fails` and `fail_timeout` provide passive failure handling based on real traffic. They are not periodic active health checks. Availability of active checks and advanced balancing features depends on edition/module/version; never copy a directive solely from a Plus tutorial into OSS.

A read timeout measures inactivity between reads, not a whole-request deadline. Retrying a payment or POST can duplicate side effects. Do not enable `non_idempotent` casually; use application idempotency keys and a deliberate retry budget. Nginx cannot transparently switch servers after response bytes have already reached the client.

## Exercise and answer
Why can the second request still reach the same backend? Worker state, policy and live connections influence selection; correctness should not depend on strict alternation. Check that multiple healthy identities appear over a sample, then verify failover and recovery.

## Official references

- [Upstream module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Retry conditions](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_next_upstream)

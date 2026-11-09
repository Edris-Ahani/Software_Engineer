[← Contents and learning path](../README.md) | [فارسی](01_012_rate_and_connection_limiting_Persian.md)

# 012 — Rate limits, bursts, and connection limits

## Goal
Protect a costly endpoint while distinguishing requests per second from concurrency. Prerequisites: trusted client IP and logs. Zone definitions belong in **http**; enforcement belongs in the selected server/location. This example assumes `$remote_addr` already represents the correct client.


```nginx
limit_req_zone $binary_remote_addr zone=login_rate:10m rate=5r/s;
limit_conn_zone $binary_remote_addr zone=active_clients:10m;

server {
    listen 8086;
    limit_req_status 429;
    limit_conn_status 429;

    location /login {
        limit_req zone=login_rate burst=10 nodelay;
        limit_conn active_clients 10;
        proxy_pass http://127.0.0.1:3000;
    }
}
```

## What the settings mean
`rate=5r/s` is a sustained rate for each key. Nginx uses a leaky bucket mechanism. `burst=10` tolerates excess requests within the burst accounting; `nodelay` lets accepted excess requests proceed immediately while their quota drains over time. It does **not** turn the policy into an unlimited “15 requests every second” fixed window. Without `nodelay`, eligible excess requests can be delayed; beyond the configured capacity they are rejected.

`limit_conn` concerns concurrent requests/connections counted under its documented rules. It does not simply count every idle keepalive socket, and HTTP/2 or HTTP/3 concurrent requests affect its accounting. It is different from a request-rate cap. These limits share state across workers in one instance; they do not automatically create a distributed quota across replicas.


```bash
# Lab implements a separate 2r/s demo at /limited/.
# This Python command is portable across Linux and Windows:
python _lab/smoke_test.py
# Linux burst probe (status distribution depends on timing):
seq 1 20 | xargs -P 10 -I '{}' \
  curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/limited/
```

## Rollout and fairness
A large NAT or corporate gateway can put many people behind one IP. Restoring real IP behind a trusted proxy is necessary before IP limits make sense. Per-user quotas require a verified identity, not an arbitrary request header chosen by the caller. Authentication failures and account-level abuse controls also belong in the application.

Consider `limit_req_dry_run on` while observing real traffic, then enforce deliberately. Expose useful rejection metrics and an application-level retry policy. Do not claim a precise Retry-After duration unless your implementation can provide one accurately.

## Exercise and answer
Why can every request become 429 after putting a proxy in front? The key may now be the proxy IP for all clients, or normal bursts exceed the new policy. Inspect the evaluated client identity and measurements before increasing the limit.

## Official references

- [Request rate limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [Connection limiting](https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html)

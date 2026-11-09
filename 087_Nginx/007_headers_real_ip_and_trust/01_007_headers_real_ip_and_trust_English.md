[← Contents and learning path](../README.md) | [فارسی](01_007_headers_real_ip_and_trust_Persian.md)

# 007 — Forwarded headers, real client IP, and trust

## Goal
Make the backend see the right public scheme and client address without trusting user supplied claims. Prerequisite: reverse proxy. Assume first that Nginx is the public edge and has **no trusted proxy in front**. Add these directives to a proxy location; repeat the full set if another location defines its own `proxy_set_header` entries.


```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $remote_addr;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header X-Request-ID $request_id;
proxy_set_header Forwarded "";
```

## Why overwrite at the public edge?
An internet client can send any `X-Forwarded-For`. At a direct edge, setting it to `$remote_addr` discards spoofed history. `$proxy_add_x_forwarded_for` appends to an existing chain; use it only when the complete proxy chain and backend trust rules are understood. The application must trust forwarded information only from known proxies and must be unreachable directly when that is an architectural requirement.

`$host` is not an authorization check; reject unexpected hostnames with an explicit default server and configure the application's allowed hosts. If TLS terminates at a load balancer, `$scheme` on the inner HTTP hop is `http`, even though the user used HTTPS.

## Behind a trusted load balancer
The next fragment belongs in `http` or `server`. `10.20.0.0/24` is an example; replace it with the exact network of your actual trusted balancers. Network ACLs must stop untrusted peers from impersonating those balancers. The realip module must be available (`nginx -V`).


```nginx
set_real_ip_from 10.20.0.0/24;
real_ip_header X-Forwarded-For;
real_ip_recursive on;
# $remote_addr becomes the selected client address.
# $realip_remote_addr retains the original connection peer.
```

## Verification
In the direct-edge lab, this forged input must not become the backend's client address:


```bash
curl -s -H 'X-Forwarded-For: 1.2.3.4' \
  -H 'Forwarded: for=1.2.3.4;proto=https' \
  http://localhost:8080/api/headers
```

## Pitfalls, exercise, and answer
Never use `set_real_ip_from 0.0.0.0/0` on a public listener. It lets untrusted peers influence IP based limits, logs and ACLs. For an outer TLS terminator, accept its scheme header only on a path restricted to that trusted peer, with an explicit validation policy; blindly echoing any `X-Forwarded-Proto` is unsafe.

Exercise: explain why rate limiting all requests by the balancer's IP breaks fairness. Answer: every user shares one key until the real client address is restored safely. Log both the client address and original peer while validating the chain.

## Official references

- [Real IP module](https://nginx.org/en/docs/http/ngx_http_realip_module.html)
- [Proxy request headers](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_set_header)

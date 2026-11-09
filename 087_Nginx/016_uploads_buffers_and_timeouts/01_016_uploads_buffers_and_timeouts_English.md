[← Contents and learning path](../README.md) | [فارسی](01_016_uploads_buffers_and_timeouts_Persian.md)

# 016 — Uploads, buffers, timeouts, and request budgets

## Goal
Set limits that match workload and diagnose 413/502/504 without hiding a slow backend. Prerequisites: proxying and logs. Place this **location fragment inside a server**. It needs an upload-capable backend on port 3000; for a runnable small upload use the lab's `/api/upload` route.


```nginx
location /upload/ {
    client_max_body_size 20m;
    client_body_timeout 15s;
    proxy_connect_timeout 3s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    send_timeout 30s;

    proxy_request_buffering on;
    proxy_buffering on;
    proxy_pass http://127.0.0.1:3000;
}
```

## Different controls govern different directions

| Setting | Meaning |
| --- | --- |
| `client_max_body_size` | Maximum allowed request body size |
| `client_body_timeout` | Idle interval while reading the client body |
| `proxy_connect_timeout` | Time allowed to establish the upstream connection |
| `proxy_send_timeout` | Idle interval between writes of the request upstream |
| `proxy_read_timeout` | Idle interval between reads of the response upstream |
| `send_timeout` | Idle interval while writing the response to the client |

These idle limits are not a single end-to-end deadline. A backend that trickles data can remain active much longer than the read timeout. Set an application deadline for operations such as database calls, and align it with proxy/client retry budgets.

## Request and response buffering are separate
With request buffering on, Nginx receives the body before forwarding it and may spill to temporary disk. This protects the application from slow uploads but consumes local storage/I/O. With it off, streaming reduces pre-buffering but ties upstream resources to the client and restricts safe retries once bytes have been sent.

Response buffering decouples a fast upstream from a slow client; it can use memory and temporary files. Turn it off for real-time streams where needed, rather than globally. Large upstream response headers can trigger errors independently of body size; inspect the error log before changing `proxy_buffer_size` or related buffers.


```bash
# Small upload against the lab (1 MiB limit):
python -c "import urllib.request; r=urllib.request.urlopen(urllib.request.Request('http://localhost:8080/api/upload',data=b'hello',method='POST')); print(r.status,r.read().decode())"
# Oversize request: the smoke test checks that this produces 413.
python _lab/smoke_test.py
```

## Verification and exercise
Test a small valid body, a just-over-limit body, a slow client, and a delayed backend separately. Also check outer CDN/load-balancer limits and application parser limits. The strictest layer may reject first.

Exercise: a 100 MiB upload fails with 413 even after setting the application limit to 200 MiB. Answer: inspect the effective Nginx location limit and every preceding hop. Raising `proxy_read_timeout` cannot change a body-size rejection. For very large files consider object-storage uploads with short lived scoped upload authorization.

## Official references

- [Body size and client timeouts](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Proxy buffering and timeouts](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

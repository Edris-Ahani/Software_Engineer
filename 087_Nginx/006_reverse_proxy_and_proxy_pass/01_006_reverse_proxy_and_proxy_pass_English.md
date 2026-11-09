[← Contents and learning path](../README.md) | [فارسی](01_006_reverse_proxy_and_proxy_pass_Persian.md)

# 006 — Reverse proxy and the proxy_pass trailing slash

## Goal and setup
Predict the exact path the application receives. Prerequisites: HTTP and locations. The two locations below are **alternatives**, not blocks to enable together. In the Docker lab the backend is `app1:8000`; on a Linux host it might be `127.0.0.1:3000`. A container's loopback address points to that container.


```nginx
# Alternative A: preserve the /api/ prefix (inside server)
location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Alternative B: remove the /api/ prefix (inside server)
# location /api/ {
#     proxy_pass http://127.0.0.1:3000/;
#     proxy_http_version 1.1;
#     proxy_set_header Host $host;
#     proxy_set_header X-Forwarded-Proto $scheme;
# }
```

## Work through a request
For `/api/orders?status=open`, alternative A sends `/api/orders?status=open`; B sends `/orders?status=open`. Without a URI part, `proxy_pass` forwards the request URI subject to documented normalization/rewrite cases. With a URI part `/`, that part replaces the matched prefix. This explanation assumes a plain prefix location, no rewrite, and a literal upstream URL. Regex locations, variables in `proxy_pass`, and rewritten URIs have additional rules.

`proxy_http_version 1.1` makes the upstream protocol explicit across versions. The public browser connection can be HTTP/2 while the upstream connection is HTTP/1.1. `proxy_set_header Host $host` changes the default upstream Host behavior; choose the value the backend expects. Connection reuse and trust in forwarding headers are covered in later lessons.


```bash
# With the repository lab running:
curl -s 'http://localhost:8080/api/orders?status=open'
curl -s 'http://localhost:8080/preserve/orders?status=open'
# Inspect path and headers in the JSON, not just the HTTP status.
```

## Expected result
The lab strips `/api/`, so its JSON path is `/orders?status=open`. The `/preserve/` location preserves `/preserve/orders?status=open`. A 200 alone cannot detect an accidentally removed API version prefix.

## Common failures
A 502 may mean connection refused, DNS failure, or an invalid upstream response; read the error log. A 404 from the application may simply mean the forwarded path is wrong. Check redirects and cookie paths when moving an application under a prefix; the application should know its external base URL. `proxy_redirect` changes certain response headers; it does not rewrite arbitrary HTML or JavaScript.

## Exercise and answer
Your backend registers `/v1/users` but the public URL is `/api/v1/users`. Choose a trailing slash to remove `/api/`. If the backend instead registers `/api/v1/users`, omit the URI slash. Verify against the backend's access log.

## Official references

- [proxy_pass semantics](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)

[← Contents and learning path](../README.md) | [فارسی](01_011_proxy_cache_and_browser_cache_Persian.md)

# 011 — Proxy cache, cache keys, and browser caching

## Goal and prerequisites
Cache explicitly public responses without leaking personalized data. Prerequisites: proxying, headers, and HTTP caching concepts. This **HTTP-context fragment** is an example for a public catalogue, not a global API caching policy. The Nginx worker must be able to write to the cache directory.


```nginx
proxy_cache_path /var/cache/nginx/catalog levels=1:2
    keys_zone=catalog:10m max_size=100m inactive=10m;

map $http_authorization $has_auth { default 1; "" 0; }
map $http_cookie $has_cookie { default 1; "" 0; }

server {
    listen 8085;
    location /catalog/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache catalog;
        proxy_cache_key "$scheme|$host|$proxy_host|$request_uri";
        proxy_cache_valid 200 30s;
        proxy_cache_lock on;
        proxy_cache_bypass $has_auth $has_cookie;
        proxy_no_cache $has_auth $has_cookie;
        add_header X-Cache-Status $upstream_cache_status always;
    }
}
```

## Read the policy carefully
The zone stores metadata; cached bodies are on disk. `inactive` evicts entries unused for that period, even if otherwise fresh. The key includes host and query string so distinct tenants or query variants do not accidentally share an entry. Treat the key as part of the application's data isolation design.

`proxy_cache_bypass` avoids reading an existing cached response; `proxy_no_cache` avoids saving the new response. Both matter for authenticated/cookie requests. This deliberately conservative example excludes every cookie, which can reduce hit rate. Normal upstream `Cache-Control`, `Expires`, `Set-Cookie`, and `Vary` behavior also matters. Do not casually ignore those headers or cache endpoints where identity is conveyed in other ways.

`proxy_cache_lock` reduces duplicate population work for the same key. Serving stale data can improve availability but needs a business decision about acceptable staleness. Purge capabilities vary; a versioned key or bounded TTL can be simpler.


```bash
# Lab has the same behavior at /cache/:
curl -i 'http://localhost:8080/cache/products?case=lesson11'
curl -i 'http://localhost:8080/cache/products?case=lesson11'
curl -i -H 'Authorization: Bearer demo' \
  'http://localhost:8080/cache/products?case=lesson11'
curl -i -H 'Cookie: session=demo' \
  'http://localhost:8080/cache/products?case=lesson11'
```

## Expected results
For a fresh key: `MISS`, then `HIT` with the same backend timestamp; requests with Authorization or Cookie report `BYPASS`. Use a new query value if an entry already exists. After TTL expiry, the timestamp changes on refresh.

Browser caching is independent: a hashed static filename can receive a long `Cache-Control: public, max-age=31536000, immutable`; only do this if content changes produce a new filename. Keep HTML short lived or revalidated. `no-cache` means revalidate; `no-store` prohibits storage. Nginx proxy cache HIT does not prove a browser cache hit.

## Exercise and answer
Why is `$uri` alone a dangerous product search cache key? It excludes the query arguments, so different searches can collide. Include relevant arguments and identity dimensions, or decline to cache.

## Official references

- [Proxy cache directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_cache)
- [Response headers](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

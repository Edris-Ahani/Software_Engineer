[← Contents and learning path](../README.md) | [فارسی](01_014_redirects_rewrites_and_map_Persian.md)

# 014 — Redirects, internal rewrites, variables, and map

## Goal
Choose the smallest routing tool that matches the requirement. Prerequisites: location selection and URI variables. A redirect tells the client to make a new request. An internal rewrite changes processing within Nginx. `map` derives a variable without sending a response.


```nginx
# HTTP context
map $http_x_release $release_label {
    default stable;
    "preview" preview;
}

server {
    listen 8087;
    server_name localhost;

    location = /old-docs {
        return 302 /docs/;
    }
    location /legacy/ {
        rewrite ^/legacy/(.*)$ /v2/$1 last;
    }
    location /v2/ {
        add_header X-Release $release_label always;
        return 200 "current uri: $uri; original: $request_uri\n";
    }
    location / { return 404; }
}
```

## Trace the behavior
`/old-docs` returns 302 and a Location header; the browser's address changes after following it. `/legacy/item?id=7` rewrites to `/v2/item` and starts location selection again because of `last`. Existing query arguments remain unless the replacement deliberately changes/discards them. `$request_uri` remains the original input while `$uri` reflects the current path.

`break` stops the current rewrite sequence without starting another location lookup in the same way. Using the wrong flag can produce the wrong handler or a rewrite loop. Prefer `return` for a simple redirect and `try_files` for disk existence checks.

`map` belongs in `http` and is useful for small allow lists. The sample header only changes a debug label; it must not grant access or expose a private deployment. Never let an arbitrary hostname from an untrusted header become a dynamic proxy target; that can create an SSRF/open-proxy problem.


```bash
curl -i http://127.0.0.1:8087/old-docs
curl -i 'http://127.0.0.1:8087/legacy/item?id=7'
curl -i -H 'X-Release: preview' http://127.0.0.1:8087/v2/item
curl -i -H 'X-Release: anything' http://127.0.0.1:8087/v2/item
```

## Status codes and rollout
Use temporary 302/307 while verifying a migration. 307/308 preserve the request method; 301/302 have historical client method-changing behavior. Permanent redirects can persist in clients and caches, making mistakes harder to reverse. Decide whether query arguments must be preserved. Use a fixed canonical host rather than reflecting arbitrary Host values.

## Exercise and answer
Why does a permanent redirect from A to B combined with another rule from B to A fail? The browser loops between requests. An internal rewrite loop instead occurs inside the server and can reach its rewrite cycle limit. Diagnose with Location headers, `curl -i`, and error logs before using `curl -L`.

## Official references

- [Rewrite module](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html)
- [Map module](https://nginx.org/en/docs/http/ngx_http_map_module.html)

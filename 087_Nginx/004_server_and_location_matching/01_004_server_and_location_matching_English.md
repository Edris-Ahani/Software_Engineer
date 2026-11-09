[← Contents and learning path](../README.md) | [فارسی](01_004_server_and_location_matching_Persian.md)

# 004 — Virtual hosts and location selection

## Learning goal
Predict which block handles a request. Prerequisites: contexts and basic HTTP. Put this **HTTP-context fragment** in a loaded `conf.d/routing.conf` on a disposable instance; it defines two servers on port 8081.


```nginx
server {
    listen 8081 default_server;
    server_name _;
    return 404;
}

server {
    listen 8081;
    server_name shop.example.test;

    location = /healthz { return 200 "exact\n"; }
    location ^~ /assets/ { return 200 "assets prefix\n"; }
    location ~* \.(jpg|png)$ { return 200 "image regex\n"; }
    location /api/ { return 200 "api prefix\n"; }
    location / { return 200 "fallback prefix\n"; }
}
```

## Selection in this flat example
First the listener address/port narrows the server candidates; HTTP Host selects the virtual server. The default is attached to the listener, not to the string `_`. `_` is merely an unlikely hostname. HTTPS also involves SNI before HTTP, which affects certificate selection.

For the flat locations above: an exact `=` match wins. Otherwise Nginx remembers the longest prefix. If that prefix has `^~`, regex evaluation is skipped. Otherwise the first matching regex in file order wins; if none matches, the remembered prefix is used. `~` is case sensitive, `~*` is case insensitive. Nested locations and internal redirects need additional tracing; do not generalize this flat recipe blindly.


```bash
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/healthz
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/assets/a.png
curl -i -H 'Host: shop.example.test' http://127.0.0.1:8081/api/a.png
curl -i -H 'Host: unknown.example.test' http://127.0.0.1:8081/
```

## Explain the outputs
The four responses are `exact`, `assets prefix`, `image regex`, and a 404. `/api/a.png` matches `/api/`, but the regex can override that prefix. Query strings are not part of location matching: `/healthz?verbose=1` still matches `= /healthz`.

`$request_uri` preserves the original URI including arguments. `$uri` is the current normalized URI without arguments and may change during internal redirects. A prefix `/api` also matches `/apiculture`; use `/api/` and handle the bare `/api` deliberately.

## Exercise and answer
Why does changing `/api/` to `^~ /api/` change `/api/a.png`? Because regex evaluation is skipped for the winning prefix. Verify both versions and inspect `nginx -T` if a different server unexpectedly handles the request.

## Official references

- [Request processing](https://nginx.org/en/docs/http/request_processing.html)
- [Location reference](https://nginx.org/en/docs/http/ngx_http_core_module.html#location)

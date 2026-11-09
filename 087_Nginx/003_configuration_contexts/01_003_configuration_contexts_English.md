[← Contents and learning path](../README.md) | [فارسی](01_003_configuration_contexts_Persian.md)

# 003 — Configuration structure, contexts, and includes

## Learning goal
Know exactly where a directive is legal. Prerequisite: lesson 002. This example is a **complete standalone nginx.conf** for a Linux package or official container with `/etc/nginx/mime.types`. It replaces the main file; do not paste it into `conf.d/`.


```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;

    server {
        listen 8080;
        server_name localhost;
        location = /healthz {
            default_type text/plain;
            return 200 "ok\n";
        }
        location / {
            return 404;
        }
    }
}
```

## Read it from the outside in

| Context | Contains | Example |
| --- | --- | --- |
| Main | Process settings and major blocks | `worker_processes`, `events`, `http` |
| `events` | Connection processing settings | `worker_connections` |
| `http` | HTTP-wide definitions and servers | `map`, `upstream`, `log_format`, `server` |
| `server` | A virtual HTTP server | `listen`, `server_name`, `location` |
| `location` | Request path behavior | `proxy_pass`, `try_files` |

A simple directive ends with `;`; a block uses braces. `#` begins a comment. `include` acts at its insertion point, so a file included inside `http` already has that context. A typical `conf.d/demo.conf` contains a `server` block, without another `http` block.

## Inheritance is directive specific
Do not assume that every child block appends to parent settings. For example, with the traditional header inheritance behavior, defining any `add_header` in a location replaces inherited `add_header` entries there. `proxy_set_header` has a similar all-or-nothing inheritance rule for its own set. Check the installed version and directive documentation. Explicit shared snippets are easier to review than accidental inheritance.


```bash
sudo nginx -t
sudo nginx -T
# Reload only after the syntax check succeeds.
curl -i http://127.0.0.1:8080/healthz
curl -i http://127.0.0.1:8080/missing
```

## Expected results and pitfalls
Expect 200 with `ok` for `/healthz` and 404 for `/missing`. A port conflict means an existing listener needs investigation, not an arbitrary restart. A config file named `demo.conf.disabled` is not read by an include matching `*.conf`.

## Exercise and answer
Move `worker_connections` into `http` in a disposable copy. `nginx -t` should report that it is not allowed there. Move it back to `events`. Explain why `nginx -t` can pass when your new file is never included: it only validates the loaded configuration.

## Official references

- [Configuration structure](https://nginx.org/en/docs/beginners_guide.html)
- [Header inheritance](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- [Proxy directives](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

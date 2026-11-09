[← Contents and learning path](../README.md) | [فارسی](01_017_performance_compression_and_capacity_Persian.md)

# 017 — Performance, compression, and capacity planning

## Goal and prerequisites
Tune a measured bottleneck rather than copy a large configuration. Prerequisites: logs, connections, caching and buffers. The following is a **complete main configuration skeleton** for a Linux package; the static directory and `mime.types` must exist. Values are teaching examples, not universal production defaults.


```nginx
worker_processes auto;
events { worker_connections 2048; }
http {
    include /etc/nginx/mime.types;
    sendfile on;
    tcp_nopush on;
    keepalive_timeout 30s;

    gzip on;
    gzip_vary on;
    gzip_comp_level 4;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/javascript application/json;

    server {
        listen 8089;
        root /srv/www/site;
        location / { try_files $uri =404; }
    }
}
```

## Connections are not users
A rough worker-connection budget is workers × worker_connections, but it includes upstream and other connections and is further limited by file descriptors and OS/service limits. If a busy proxied request uses two sockets, the client count is much smaller than that naive product. Idle keepalive sockets also consume resources. Inspect the running service's limits before raising numbers.

Compression trades CPU for bandwidth. Already compressed images, video and archives often gain little. Brotli is not guaranteed to be present in a standard build; verify modules. TLS compression of secret-bearing reflected responses can introduce information leaks; choose which responses to compress deliberately.

`sendfile` can help static file delivery. It cannot repair slow database queries. Proxy caches, application work and database indexes often matter more than one TCP knob.


```bash
# Inspect headers without losing Content-Encoding information:
curl -s -D - -o /dev/null -H 'Accept-Encoding: gzip' \
  http://127.0.0.1:8089/assets/large.js
# Inspect the service's actual open-file limit:
systemctl show nginx -p LimitNOFILE
# Use your load generator against a disposable environment, not a live service.
```

## A useful experiment
Start with a representative route mix and realistic payload sizes. Record request rate, p50/p95/p99 latency, errors, CPU, RSS, open files, network bandwidth, disk I/O and upstream saturation. Increase load gradually, then change one parameter and compare the same workload. A tiny local benchmark can measure the load generator rather than the server.

For compression verification expect `Content-Encoding: gzip` only for eligible sufficiently large responses; it may be absent for a tiny file. `Vary: Accept-Encoding` tells downstream caches that encodings differ.

## Exercise and answer
You double worker connections but 504 errors remain and database latency grows. What next? Restore a bounded configuration, inspect upstream saturation, and reduce expensive work or add suitable capacity. More proxy concurrency can amplify overload rather than improve throughput.

## Official references

- [Gzip module](https://nginx.org/en/docs/http/ngx_http_gzip_module.html)
- [Core process directives](https://nginx.org/en/docs/ngx_core_module.html)

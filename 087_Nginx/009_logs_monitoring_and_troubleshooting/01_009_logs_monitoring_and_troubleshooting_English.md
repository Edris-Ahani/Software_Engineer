[← Contents and learning path](../README.md) | [فارسی](01_009_logs_monitoring_and_troubleshooting_Persian.md)

# 009 — Logs, timing, monitoring, and troubleshooting

## Goal
Find the failed layer from evidence. Prerequisites: reverse proxy and HTTP status codes. Put `log_format` in **http**, then use the format from a server. Quoting numerical fields keeps missing values such as `-` valid JSON strings.


```nginx
log_format timing escape=json
    '{"time":"$time_iso8601","id":"$request_id",'
    '"client":"$remote_addr","method":"$request_method",'
    '"uri":"$uri","status":"$status",'
    '"request_time":"$request_time",'
    '"upstream":"$upstream_addr","upstream_status":"$upstream_status",'
    '"upstream_time":"$upstream_response_time"}';

server {
    listen 8083;
    access_log /var/log/nginx/timing.log timing;
    error_log /var/log/nginx/error.log warn;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header X-Request-ID $request_id;
        add_header X-Request-ID $request_id always;
    }
}
```

## Interpret the fields
`request_time` covers the request as observed by Nginx, including receiving and sending data. `upstream_response_time` measures the upstream interaction and can contain several values when multiple attempts occur. A large difference can reflect client speed or buffering; it is not a precise CPU attribution. An empty upstream address on a static response is normal.

The log uses `$uri` to avoid recording query strings that often contain tokens. Paths can still contain sensitive identifiers; define retention and access rules. Do not log Authorization, session cookies, or request bodies by default. The generated request ID connects proxy logs to application logs if the application records it.


```bash
# Linux service:
sudo tail -f /var/log/nginx/error.log /var/log/nginx/timing.log
# Docker lab, from 087_Nginx:
docker compose -f _lab/compose.yaml logs --tail=50 nginx
curl -i http://localhost:8080/api/hello
```

## Diagnosis table

| Symptom | First useful check |
| --- | --- |
| 404 | Which server/location answered? Does the file or application route exist? |
| 403 | Filesystem traversal/read permission, ACL, auth rule, missing index |
| 413 | Effective `client_max_body_size` and any outer proxy limit |
| 429 | Rate-limit key, request pattern, and shared proxy IP |
| 499 in log | Client closed the connection; correlate client and upstream timing |
| 502 | Error log, upstream process/listener, DNS, protocol mismatch |
| 504 | Upstream timeout; correlate slow application/dependency work |

Probe each hop: resolve DNS, connect port, validate TLS, select virtual host, inspect route, call upstream from Nginx's network namespace. Alert on error ratios and latency percentiles with traffic volume, not one isolated failure. Check disk capacity and log rotation; a huge log can exhaust the filesystem.

## Exercise and answer
Stop one lab backend and request `/api/hello`. Successful failover may hide that instance's failure from the final status. Inspect upstream attempts in logs, then restore it. If a backend is recreated with a different container IP, use the DNS/reload guidance in lesson 019.

## Official references

- [HTTP log format](https://nginx.org/en/docs/http/ngx_http_log_module.html)
- [Core variables](https://nginx.org/en/docs/http/ngx_http_core_module.html#variables)

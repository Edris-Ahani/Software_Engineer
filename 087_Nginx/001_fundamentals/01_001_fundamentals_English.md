[← Contents and learning path](../README.md) | [فارسی](01_001_fundamentals_Persian.md)

# 001 — What Nginx does and how requests flow

## Learning goal
Explain where Nginx belongs before changing any configuration. Prerequisites: a basic idea of a URL, IP address, and process.

A browser resolves a domain with DNS, opens a TCP connection (or QUIC for HTTP/3), negotiates TLS for HTTPS, then sends an HTTP request. Nginx can answer directly from disk, return a redirect, or open another connection to an application. These are distinct steps: a valid DNS record does not prove that a port is reachable or that a certificate is valid.


```text
Browser → DNS → Nginx :443 → application :3000 → database
                       └──→ /srv/www/assets/logo.svg

GET /api/orders?limit=10 HTTP/1.1
Host: shop.example.test
```

## Concepts you must distinguish

| Role | Responsibility | Example |
| --- | --- | --- |
| Web server | Return files and HTTP responses | Serve `/assets/logo.svg` |
| Reverse proxy | Route an incoming request to a backend | `/api/orders` → Node.js |
| Load balancer | Choose between backend instances | `app1` or `app2` |
| HTTP cache | Reuse eligible responses | Public product catalogue |
| Application | Business rules and authorization | Check who owns an order |

Nginx does not execute JavaScript, Python, or PHP application code by itself. A PHP application normally uses PHP-FPM via FastCGI. A reverse proxy also needs network rules if direct backend access must be prevented.

## First experiment
Run the Docker lab described in [the run guide](../00_HOW_TO_RUN_English.md), then issue these commands. On Windows use `curl.exe` when typing curl commands directly in PowerShell.


```bash
curl -i http://localhost:8080/
curl -i http://localhost:8080/api/hello?name=nginx
curl -i http://localhost:8080/healthz
```

## Read the result
`/` is a static page. `/api/hello` returns JSON with a backend identity, timestamp, and forwarded path. `/healthz` is answered by Nginx itself, so a 200 here does **not** establish that the application or database is healthy. Readiness checks must cover whichever dependencies are required for traffic.

## Architecture and limits
The master process manages configuration and workers. Workers use event driven I/O to handle many connections; this does not make CPU work free. A proxied request can consume both a client connection and an upstream connection. Slow clients, disk I/O, memory, file descriptors, and upstream capacity all matter.

## Exercise and answer
If `/healthz` returns 200 while `/api/hello` returns 502, is DNS the first suspect? No: the request already reached Nginx. Inspect the upstream process, port, network and error log. Draw both connections and identify which one failed.

## Official references

- [Beginner’s guide](https://nginx.org/en/docs/beginners_guide.html)

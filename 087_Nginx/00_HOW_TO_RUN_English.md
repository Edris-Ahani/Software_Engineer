# Running the Nginx examples

[Contents and learning path](README.md) | [فارسی](00_HOW_TO_RUN_Persian.md)

## Requirements

- Docker Desktop/Engine running **Linux containers**, with Compose v2 supporting `up --wait`.
- Python 3.10 or newer on the host for checks; no pip packages are required.
- Internet access for the first image download, plus an available local port 8080.

The lab is a local HTTP environment. It does not install Nginx as a host service. If `docker version` cannot show a server, start the Docker engine/Desktop before continuing. Linux `apt` and `systemctl` commands in lessons need a Linux host/VM/appropriate WSL setup; they are not native PowerShell commands.

## Start from the repository root

```bash
cd 087_Nginx
docker version
docker compose version
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
```

Open [the local lab](http://localhost:8080). The first run downloads two images. Python backends must become healthy before Nginx starts. If startup fails, inspect logs rather than repeatedly restarting everything:

```bash
docker compose -f _lab/compose.yaml ps
docker compose -f _lab/compose.yaml logs --tail=50
```

## Try each behavior

On PowerShell, use `curl.exe` for the following curl commands; `curl` may be a PowerShell alias. The Python smoke test works on both Windows and Linux.

```bash
curl -i http://localhost:8080/
curl -i http://localhost:8080/healthz
curl -s 'http://localhost:8080/api/orders?status=open'
curl -s 'http://localhost:8080/preserve/orders?status=open'
curl -i 'http://localhost:8080/cache/products?run=manual1'
curl -i 'http://localhost:8080/cache/products?run=manual1'
curl -i -H 'Authorization: Bearer demo' 'http://localhost:8080/cache/products?run=manual1'
curl -i -H 'Cookie: session=demo' 'http://localhost:8080/cache/products?run=manual1'
curl -N http://localhost:8080/events/
curl -i http://localhost:8080/old-docs
```

| Route | Expected behavior |
| --- | --- |
| `/` | Static bilingual HTML from Nginx |
| `/healthz` | `200 ok`; Nginx health only |
| `/api/orders?status=open` | Backend sees `/orders?status=open` |
| `/preserve/orders?status=open` | Backend sees the unchanged path |
| `/cache/products` | Fresh key: MISS then HIT for 30 seconds |
| `/cache/products` with auth/cookie | BYPASS; personalized requests excluded |
| `/limited/` | Sustained 2r/s per observed IP, burst 2; excess returns 429 |
| `/events/` | Three SSE events, 0.3 seconds apart |
| `/api/upload` with POST | JSON received-byte count; limit 1 MiB |
| `/assets/missing.js` | 404, no SPA HTML fallback |
| `/old-docs` | 302 to `/docs/` |

The demo backend returns JSON for arbitrary GET paths to expose forwarding behavior; it is not a real application router or production HTTP server. `/products` is the only cacheable backend route. A fresh cache query value helps repeat MISS/HIT experiments. Two backend identities should appear across several uncached requests; exact alternation is not guaranteed.

## Change, validate, reload

Edit `_lab/nginx.conf` or `_lab/proxy_headers.conf`, then:

```bash
docker compose -f _lab/compose.yaml exec nginx nginx -t
# Only after a successful check:
docker compose -f _lab/compose.yaml exec nginx nginx -s reload
python _lab/smoke_test.py
docker compose -f _lab/compose.yaml logs --tail=30 nginx
```

The checks intentionally require both backends healthy. If you change the documented routing/limits, update the relevant expected behavior deliberately. A port change requires editing the host mapping and passing the matching URL:

```bash
python _lab/smoke_test.py --base-url http://127.0.0.1:8081
```

Recreating a backend can change its IP. Wait for health, then reload Nginx to refresh literal upstream resolution. For a clean reset, bring the entire stack down and up. Image tags move; record/pin reviewed digests for reproducible deployments.

## Optional failure experiment

```bash
docker compose -f _lab/compose.yaml stop app1
curl -i http://localhost:8080/api/hello
docker compose -f _lab/compose.yaml logs --tail=20 nginx
docker compose -f _lab/compose.yaml start app1
```

Expect service through the other backend, potentially with a failed attempt in the log. This is a manual failure experiment, not the normal two-backend smoke-test state. Restore the backend and allow recovery before rerunning checks.

## Documentation checks and cleanup

```bash
python _shared/validate_docs.py
docker compose -f _lab/compose.yaml down
```

The documentation check validates 22 bilingual pairs, local links, UTF-8 readability and code fences. It does not prove Nginx directive semantics. The behavioral smoke test verifies static serving, path forwarding, spoofed-header removal, request IDs, both backends, cache behavior, upload limits, redirect, incremental SSE and rate rejection.

No lab database or named volume is created. `down` removes this stack's containers/network; the container-local cache is discarded on recreation. TLS/mTLS, PHP-FPM, gRPC, stream and QUIC examples state separate requirements in their lessons. Do not combine independent snippets into one configuration.

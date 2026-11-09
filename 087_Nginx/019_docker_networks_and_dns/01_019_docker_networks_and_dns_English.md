[← Contents and learning path](../README.md) | [فارسی](01_019_docker_networks_and_dns_Persian.md)

# 019 — Docker, service DNS, and reproducible configuration

## Goal and prerequisites
Run the complete teaching environment and understand container networking. Prerequisites: Docker Engine/Desktop with Linux containers and Compose v2. The lab binds only `127.0.0.1:8080` on the host and exposes no backend port to the host. Run these commands from `087_Nginx`.


```bash
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
docker compose -f _lab/compose.yaml logs --tail=30 nginx
# After editing the mounted Nginx configuration:
docker compose -f _lab/compose.yaml exec nginx nginx -t
docker compose -f _lab/compose.yaml exec nginx nginx -s reload
# Finish the lab:
docker compose -f _lab/compose.yaml down
```

## Addressing explained
Inside the Compose network `app1:8000` resolves to a backend container. `localhost:8000` inside Nginx would refer to Nginx's own container. `ports` publishes to the host; internal service-to-service communication does not require a published backend port. A network boundary still needs review before internet deployment; this is a local learning stack.

The lab mounts the main `nginx.conf`, HTML, and backend source read-only. Its cache lives in the container's writable layer and may survive stop/start but disappears on container recreation. No database or persistent user data is involved. Backend images use only the Python standard library.

## Startup readiness and DNS changes
`depends_on` alone is only ordering, not application readiness. The lab uses backend health checks plus `condition: service_healthy`. The Nginx health check probes only its own `/healthz`; smoke tests also exercise the application paths.

Literal upstream hostnames are resolved when configuration is loaded. If a backend is recreated with another IP, reload Nginx after the backend is healthy. Recent OSS versions support additional dynamic upstream DNS features, but their syntax/version requirements must be checked. Do not assume every old build refreshes a hostname on every request. For a lab reset, bring the whole stack down/up so resolution starts fresh.


```yaml
# Structural excerpt; the full runnable file is _lab/compose.yaml.
services:
  nginx:
    image: nginx:stable-alpine
    ports:
      - "127.0.0.1:8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
  app1:
    image: python:3.13-alpine
    command: ["python", "/app/backend.py"]
```

## Reproducibility and exercise
The excerpt is explanatory and omits dependencies, environment, health checks and backend mounts; run the full file. Tags such as `stable-alpine` move over time. Before a production rollout, select a supported patched release, pin reviewed image digests, and record the Nginx/module build. The lab avoids asserting a frozen “latest” version.

Exercise: Docker reports that the Linux engine pipe/socket does not exist. Does editing nginx.conf help? No. Start the Docker engine/Desktop, verify `docker version`, then run Compose. If port 8080 is occupied, change the host port and pass the matching `--base-url` to the smoke test.

## Official references

- [Upstream name resolution](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Nginx build options](https://nginx.org/en/docs/configure.html)

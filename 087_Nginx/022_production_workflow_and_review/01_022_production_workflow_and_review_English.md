[← Contents and learning path](../README.md) | [فارسی](01_022_production_workflow_and_review_Persian.md)

# 022 — Deployment workflow, review, and final exercises

## Goal and prerequisites
Make configuration changes reviewable and reversible. Prerequisites: lessons 001–019, plus optional protocols/mTLS when needed. The [shared lab](../_lab/nginx.conf) combines static serving, proxying, balancing, cache, limits, SSE and JSON logs. It is a local HTTP learning setup. Public production needs actual TLS, access policy, patching and capacity decisions.

## A repeatable sequence

1. Define intended behavior with sample requests, status, path and response headers.
2. Inspect version/modules and includes; keep a known good artifact in version control.
3. Change the smallest relevant scope; review trust, cache isolation and secret paths.
4. Validate using the same image/modules and referenced files as the target.
5. Test success, expected denial, large bodies, upstream failure and recovery.
6. Deploy the reviewed artifact, check syntax, reload, then probe public routes with certificate verification.
7. Observe latency, errors, upstream attempts and capacity; restore the previous artifact if rollback criteria trigger.

Syntax validation cannot replace behavioral checks. A different staging image can hide unsupported directives.


```bash
# From 087_Nginx:
python _shared/validate_docs.py
docker compose -f _lab/compose.yaml config --quiet
docker compose -f _lab/compose.yaml up -d --wait
docker compose -f _lab/compose.yaml exec nginx nginx -t
python _lab/smoke_test.py
# Linux service rollout after staging validation:
sudo nginx -t && sudo systemctl reload nginx
curl -i https://app.example.com/healthz
```

## Review questions

| Area | Question |
| --- | --- |
| Routing | Is the API prefix intentionally preserved/removed? Can regex override it? |
| Identity | Which peers may set client identity? Is direct backend access controlled? |
| TLS | Correct SAN/chain, key permissions, renewal, upstream verification? |
| Cache | Public data only, auth/cookie bypass, tenant/query isolation? |
| Limits | Correct IP key, body size, burst and timeout budgets? |
| Failure | Safe retries, known rollback artifact, stream draining/reconnects? |
| Logs | Correlatable IDs, useful timings, bounded retention without secrets? |
| Dependencies | Files, modules, DNS, certificates and backend readiness present? |

The doc validator checks structure, links and fences, not Nginx semantics. Smoke tests probe the lab. PHP, public ACME, gRPC, QUIC and mTLS require their stated environments.

## Final scenarios and answers
An authenticated user sees another user's cached profile after a release. Stop serving the unsafe shared cache for that route and restore a known good policy; shortening the TTL is insufficient. Inspect key design, auth/cookie detection, cache headers and ignored response headers. Invalidate affected cached data and add a user-isolation regression probe.

Uploads work locally but fail through the public hostname: compare the exact response and each hop's body/time limits. The rejecting layer may be the CDN or application.

You should now explain root/alias, proxy_pass slash behavior, location order, termination/passthrough, cache bypass/no-cache, passive checks and retry risks. Explain why adding concurrency or timeouts can worsen overload, and demonstrate each answer with an experiment.

## Official references

- [Official documentation index](https://nginx.org/en/docs/)
- [Reload behavior](https://nginx.org/en/docs/beginners_guide.html#control)

"""Behavior checks for the running lab; no third-party dependencies.

بررسی رفتار آزمایشگاهِ در حال اجرا؛ بدون وابستگی خارجی.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
import json
import sys
import time
import urllib.error
import urllib.request
import uuid


def require(condition, message):
    if not condition:
        raise AssertionError(message)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-url", default="http://127.0.0.1:8080")
    args = parser.parse_args()
    base = args.base_url.rstrip("/")
    # Bypass host proxy settings for this local network exercise.
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())

    def request(path, headers=None, data=None):
        req = urllib.request.Request(base + path, headers=headers or {}, data=data)
        try:
            response = opener.open(req, timeout=10)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            return response.code, response.headers, response.read()

    status, _, body = request("/healthz")
    require(status == 200 and body == b"ok\n", "Nginx health endpoint")
    status, headers, body = request("/")
    require(status == 200 and b"Nginx Lab" in body, "static index")
    require(headers.get("X-Content-Type-Options") == "nosniff", "security header")
    require(request("/assets/example.txt")[0] == 200, "static asset")
    require(request("/assets/missing.js")[0] == 404, "missing asset must stay 404")

    status, headers, body = request("/api/orders?status=open", {
        "X-Forwarded-For": "1.2.3.4", "Forwarded": "for=1.2.3.4"})
    payload = json.loads(body)
    require(status == 200 and payload["path"] == "/orders?status=open", "stripped prefix")
    require(payload["headers"]["X-Forwarded-For"] != "1.2.3.4", "spoofed client IP")
    require(payload["headers"]["Forwarded"] is None, "untrusted Forwarded removed")
    require(payload["headers"]["X-Forwarded-Proto"] == "http", "public scheme")
    require(payload["headers"]["X-Request-ID"] == headers.get("X-Request-ID"), "request ID propagation")
    require(bool(headers.get("X-Request-ID")), "nonempty request ID")
    payload = json.loads(request("/preserve/orders?status=open")[2])
    require(payload["path"] == "/preserve/orders?status=open", "preserved prefix")

    identities = {json.loads(request("/api/hello")[2])["backend"] for _ in range(16)}
    require(identities == {"app1", "app2"}, f"two healthy backends: {identities}")

    key = "/cache/products?run=" + uuid.uuid4().hex
    first = request(key)
    second = request(key)
    require(first[1].get("X-Cache-Status") == "MISS", "fresh cache MISS")
    require(second[1].get("X-Cache-Status") == "HIT", "cache HIT")
    require(first[2] == second[2], "cached body preserved")
    require(second[1].get("X-Content-Type-Options") == "nosniff", "cache location security header")
    for name, value in (("Authorization", "Bearer demo"), ("Cookie", "session=demo")):
        bypass = request(key, {name: value})
        require(bypass[1].get("X-Cache-Status") == "BYPASS", f"cache bypass for {name}")
        require(bypass[2] != first[2], f"fresh response for {name}")

    status, _, body = request("/api/upload", data=b"hello")
    require(status == 200 and json.loads(body)["received_bytes"] == 5, "small upload")
    oversize = request("/api/upload", data=b"x" * (1024 * 1024 + 1))
    require(oversize[0] == 413, "oversize body 413")
    require(b"nginx" in oversize[2].lower(), "oversize request rejected at Nginx")
    redirect = request("/old-docs")
    require(redirect[0] == 302 and redirect[1].get("Location", "").endswith("/docs/"), "redirect")

    # Measure arrival of events, not just the final body.
    arrivals = []
    with opener.open(base + "/events/", timeout=10) as response:
        require(response.headers.get_content_type() == "text/event-stream", "SSE content type")
        for line in response:
            if line.startswith(b"data: "):
                arrivals.append((time.monotonic(), json.loads(line[6:])))
    require([event["event"] for _, event in arrivals] == [0, 1, 2], "SSE event sequence")
    require(arrivals[-1][0] - arrivals[0][0] >= 0.3, "events arrive incrementally")

    with ThreadPoolExecutor(max_workers=16) as pool:
        statuses = list(pool.map(lambda _: request("/limited/")[0], range(24)))
    require(200 in statuses and 429 in statuses, f"rate-limit behavior: {statuses}")
    require(set(statuses) <= {200, 429}, f"unexpected rate-limit errors: {statuses}")
    print("PASS: static files, routing, trusted headers, balancing, cache, uploads, redirect, SSE, rate limits")
    print("موفق: فایل ایستا، مسیریابی، هدرها، توزیع بار، کش، آپلود، تغییر مسیر، SSE و محدودیت نرخ")


if __name__ == "__main__":
    try:
        main()
    except (AssertionError, urllib.error.URLError, OSError, ValueError, KeyError) as error:
        print(f"FAIL: {error}", file=sys.stderr)
        print("Check that the full lab and both backends are healthy. / سلامت هر دو بک‌اند و آزمایشگاه را بررسی کنید.", file=sys.stderr)
        sys.exit(1)

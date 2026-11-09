"""Local teaching backend. Standard library only; never a production server.

بک‌اند محلی آموزشی با کتابخانهٔ استاندارد؛ مناسب تولید نیست.
"""

import json
import os
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def respond_json(self, status, payload, cache_control="no-store"):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", cache_control)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = urlsplit(self.path).path
        if path == "/health":
            self.respond_json(200, {"status": "ok"})
            return
        if path == "/events/":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream; charset=utf-8")
            self.send_header("Cache-Control", "no-store")
            self.send_header("Connection", "close")
            self.end_headers()
            self.close_connection = True
            try:
                for number in range(3):
                    data = json.dumps({"event": number, "backend": self.server.backend_name})
                    self.wfile.write(("data: " + data + "\n\n").encode("utf-8"))
                    self.wfile.flush()
                    if number < 2:
                        time.sleep(0.3)
            except (BrokenPipeError, ConnectionResetError):
                pass
            return

        # Only public /products is cacheable. All other demos are no-store.
        cache_control = "public, max-age=30" if path == "/products" else "no-store"
        self.respond_json(200, {
            "backend": self.server.backend_name,
            "path": self.path,
            "timestamp_ns": time.time_ns(),
            "headers": {
                name: self.headers.get(name)
                for name in ("Host", "X-Real-IP", "X-Forwarded-For",
                             "X-Forwarded-Proto", "X-Request-ID", "Forwarded")
            },
            "message": "Hello from the backend / سلام از بک‌اند",
        }, cache_control)

    def do_POST(self):
        # The lab deliberately accepts only small, length-delimited bodies.
        if self.headers.get("Transfer-Encoding"):
            self.close_connection = True
            self.respond_json(400, {"error": "Use Content-Length in this teaching backend"})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = -1
        if length < 0 or length > 1024 * 1024:
            self.close_connection = True
            self.respond_json(413, {"error": "Backend body limit"})
            return
        self.connection.settimeout(5)
        try:
            body = self.rfile.read(length)
        except (TimeoutError, OSError):
            self.close_connection = True
            return
        if len(body) != length:
            self.close_connection = True
            return
        self.respond_json(200, {"backend": self.server.backend_name,
                                "path": self.path, "received_bytes": len(body)})


def main():
    port = int(os.environ.get("BACKEND_PORT", "8000"))
    host = os.environ.get("BACKEND_HOST", "0.0.0.0")
    with ThreadingHTTPServer((host, port), Handler) as server:
        server.backend_name = os.environ.get("BACKEND_NAME", "app")
        print(f"Backend {server.backend_name} listening on {host}:{port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()

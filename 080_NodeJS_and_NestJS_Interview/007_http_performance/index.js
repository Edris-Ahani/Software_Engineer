/**
 * 007 — HTTP server, blocking vs non-blocking, basic metrics
 * Run: npm run 007
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { title, section, step, note, ok, warn } = require("../_shared/logger");

title("007 | HTTP, Blocking I/O & Performance Signals");

const tmp = path.join(__dirname, "payload.txt");
fs.writeFileSync(tmp, "x".repeat(2000));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");

  if (url.pathname === "/ok") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, pid: process.pid }));
    return;
  }

  if (url.pathname === "/blocking") {
    // Dangerous in real servers: blocks Event Loop
    const started = Date.now();
    fs.readFileSync(tmp);
    const blockedFor = Date.now() - started;
    res.end(JSON.stringify({ mode: "blocking-sync", blockedFor }));
    return;
  }

  if (url.pathname === "/nonblocking") {
    const started = Date.now();
    await fs.promises.readFile(tmp);
    res.end(JSON.stringify({ mode: "nonblocking-async", waited: Date.now() - started }));
    return;
  }

  if (url.pathname === "/stream") {
    res.writeHead(200, { "content-type": "text/plain" });
    fs.createReadStream(tmp).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(0, "127.0.0.1", async () => {
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  section("1) Basic http.Server request/response");
  const okRes = await fetchJson(`${base}/ok`);
  step("GET /ok", okRes);

  section("2) Blocking sync vs non-blocking async");
  // Fire a concurrent /ok while blocking handler runs — show lag conceptually
  const blocking = await fetchText(`${base}/blocking`);
  const nonblocking = await fetchText(`${base}/nonblocking`);
  step("blocking handler", blocking);
  step("nonblocking handler", nonblocking);
  warn("readFileSync inside request handlers stalls other concurrent requests");

  section("3) Streaming response body");
  const streamed = await fetchText(`${base}/stream`);
  step("streamed bytes", streamed.length);
  ok("Prefer async I/O + streams for scalable Node HTTP services");

  section("4) Lightweight runtime signals");
  const mem = process.memoryUsage();
  step("heapUsed MB", (mem.heapUsed / 1024 / 1024).toFixed(2));
  step("rss MB", (mem.rss / 1024 / 1024).toFixed(2));
  note("In production also track event-loop delay, GC pauses, and latency percentiles");

  server.close();
});

async function fetchJson(url) {
  const res = await fetch(url);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  return res.text();
}

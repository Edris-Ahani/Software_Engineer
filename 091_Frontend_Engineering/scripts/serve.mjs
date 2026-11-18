import { createServer } from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import { resolve, relative, extname, isAbsolute, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { products } from "../lib/products.mjs";

const courseRoot = fileURLToPath(new URL("../", import.meta.url));
const mimeTypes = new Map([
  [".html", "text/html; charset=utf-8"], [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"], [".svg", "image/svg+xml"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
]);

function isInside(root, target) {
  const rel = relative(root, target);
  return rel === "" || (!isAbsolute(rel) && rel !== ".." && !rel.startsWith(".." + sep));
}

export function createLabServer() {
  return createServer(async (request, response) => {
    const send = (status, type, body) => {
      response.writeHead(status, {
        "Content-Type": type, "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : body);
    };
    if (!["GET", "HEAD"].includes(request.method ?? "")) {
      send(405, "text/plain", "Method not allowed"); return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
      send(400, "text/plain", "Invalid URL"); return;
    }
    if (pathname === "/api/products") {
      send(200, "application/json", JSON.stringify(products)); return;
    }
    if (pathname === "/api/failure") {
      send(503, "application/json", JSON.stringify({ error: "Simulated temporary failure" })); return;
    }
    if (pathname === "/api/events") {
      response.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store" });
      if (request.method === "HEAD") { response.end(); return; }
      let count = 0;
      const timer = setInterval(() => {
        count++;
        response.write("id: " + count + "\ndata: " + JSON.stringify({ count }) + "\n\n");
        if (count === 3) { clearInterval(timer); response.end(); }
      }, 150);
      response.on("close", () => clearInterval(timer));
      return;
    }
    const segments = pathname.split("/");
    if (pathname.includes("\\") || segments.some(part =>
      part.startsWith(".") || ["node_modules", "tests", "scripts"].includes(part))) {
      send(403, "text/plain", "Forbidden"); return;
    }
    try {
      let target = resolve(courseRoot, "." + pathname);
      if (!isInside(courseRoot, target)) { send(403, "text/plain", "Forbidden"); return; }
      if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
      target = await realpath(target);
      if (!isInside(await realpath(courseRoot), target)) {
        send(403, "text/plain", "Forbidden"); return;
      }
      const mime = mimeTypes.get(extname(target));
      if (!mime) { send(404, "text/plain", "Not found"); return; }
      send(200, mime, await readFile(target));
    } catch (error) {
      const missing = ["ENOENT", "ENOTDIR"].includes(error.code);
      send(missing ? 404 : 500, "text/plain", missing ? "Not found" : "Unable to read file");
    }
  });
}

export async function listenLab(port = 4173) {
  const server = createLabServer();
  await new Promise((accept, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", accept);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const duration = Number(process.argv.find(arg => arg.startsWith("--duration="))?.split("=")[1] ?? 600);
  if (!Number.isInteger(duration) || duration < 1 || duration > 3600) {
    throw new RangeError("Duration must be 1..3600 seconds");
  }
  const server = await listenLab();
  console.log("http://127.0.0.1:4173/ - closes after " + duration + " seconds");
  const close = () => { server.closeAllConnections(); server.close(); };
  const timer = setTimeout(close, duration * 1000);
  server.on("close", () => clearTimeout(timer));
  process.once("SIGINT", close);
  process.once("SIGTERM", close);
}

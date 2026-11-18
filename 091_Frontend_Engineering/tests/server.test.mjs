import test from "node:test";
import assert from "node:assert/strict";
import { listenLab } from "../scripts/serve.mjs";
test("lab serves assets, failures, finite streams, and safe boundaries", async () => {
  const server = await listenLab(0);
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    const page = await fetch(base + "/projects/001_accessible_catalog/index.html");
    assert.equal(page.status, 200); assert.match(page.headers.get("content-type"), /text\/html/);
    assert.match(await page.text(), /Accessible catalog/);
    for (const path of ["/missing.js", "/missing/index.html"]) assert.equal((await fetch(base + path)).status, 404);
    for (const path of ["/.git/config", "/node_modules/test.js", "/%2e%2e%5cREADME.md"]) {
      assert.equal((await fetch(base + path)).status, 403);
    }
    assert.equal((await fetch(base + "/%E0%A4%A")).status, 400);
    assert.equal((await fetch(base + "/api/products", { method: "POST" })).status, 405);
    assert.equal((await fetch(base + "/api/products")).status, 200);
    assert.equal((await fetch(base + "/api/failure")).status, 503);
    const head = await fetch(base + "/assets/base.css", { method: "HEAD" });
    assert.equal(head.status, 200); assert.equal(await head.text(), "");
    const stream = await (await fetch(base + "/api/events")).text();
    assert.equal((stream.match(/^id: /gm) ?? []).length, 3);
  } finally {
    server.closeAllConnections();
    await new Promise((accept, reject) => server.close(error => error ? reject(error) : accept()));
  }
});

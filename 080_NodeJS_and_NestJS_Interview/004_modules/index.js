/**
 * 004 — CommonJS vs ESM, require cache, circular deps
 * Run: npm run 004
 */
const path = require("path");
const { title, section, step, note, ok, warn } = require("../_shared/logger");

title("004 | Module Systems & package metadata");

section("1) CommonJS require / module.exports");
const cjs = require("./lib-cjs.cjs");
step("CJS greet", cjs.greet("Nest"));
step("CJS module type hint", "file ends with .cjs → always CommonJS");

section("2) ESM via dynamic import (.mjs)");
(async () => {
  const esm = await import(pathToFileUrl(path.join(__dirname, "lib-esm.mjs")));
  step("ESM greet", esm.greet("Node"));
  step("ESM top-level await supported", "yes (in native ESM)");

  section("3) require cache (same instance)");
  const a = require("./cached-module.js");
  a.counter += 1;
  const b = require("./cached-module.js");
  step("counter after first bump", a.counter);
  step("second require sees same object", b.counter);
  step("same reference", a === b);
  ok("require.cache stores evaluated module exports");

  delete require.cache[require.resolve("./cached-module.js")];
  const c = require("./cached-module.js");
  step("after cache delete, counter resets", c.counter);

  section("4) Circular dependency → partial exports");
  // Clear any previous loads
  delete require.cache[require.resolve("./circular-a.js")];
  delete require.cache[require.resolve("./circular-b.js")];
  const circ = require("./circular-a.js");
  step("circular demo result", circ.demo());
  warn("One side may see undefined / incomplete exports during init");

  section("5) package.json fields (conceptual printout)");
  step("main", "entrypoint for CJS consumers");
  step("exports", "public API map / encapsulation");
  step("type", '"module" makes .js ESM by default');
  step("engines", "compatible Node version range");
  ok("Prefer explicit .cjs/.mjs while learning — less ambiguity");
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

function pathToFileUrl(p) {
  const { pathToFileURL } = require("url");
  return pathToFileURL(p).href;
}

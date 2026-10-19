/**
 * 008 — throw vs reject, process events, NODE_ENV
 * Run: npm run 008
 */
const { title, section, step, note, ok, warn } = require("../_shared/logger");

title("008 | Errors, Process Events & Tooling Knobs");

section("1) Synchronous throw (catchable with try/catch)");
try {
  throw new Error("sync-throw");
} catch (err) {
  step("caught sync throw", err.message);
}

section("2) Promise rejection (needs .catch / await try/catch)");
Promise.reject(new Error("async-reject")).catch((err) => {
  step("caught rejection", err.message);
});

section("3) Listeners for process-level failures (demo only)");
const onUnhandled = (reason) => {
  step("unhandledRejection listener saw", String(reason));
};
process.on("unhandledRejection", onUnhandled);

// Intentionally briefly unhandled, then we remove listener
Promise.reject(new Error("temporary-unhandled"));

setTimeout(() => {
  process.off("unhandledRejection", onUnhandled);

  section("4) Why not keep running after uncaughtException?");
  note("Process state may be corrupted (half-finished writes, bad invariants).");
  note("Best practice: log → alert → graceful shutdown → let process manager restart.");
  warn("uncaughtException is a last-resort signal, not a recovery strategy");

  section("5) NODE_ENV behavior switch");
  const env = process.env.NODE_ENV || "undefined";
  step("current NODE_ENV", env);
  const isProd = env === "production";
  step("verbose errors", isProd ? "hidden/generic" : "detailed stack traces");
  step("caching / optimizations", isProd ? "usually enabled" : "often relaxed for DX");

  section("6) Tooling reminders");
  step("npm scripts", "repeatable project tasks in package.json");
  step("npx", "run package binaries without global install");
  step("package-lock.json", "reproducible dependency tree");
  ok("Handle errors at the right layer; fail fast at the process boundary when unknown");
}, 20);

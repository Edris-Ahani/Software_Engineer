/**
 * 006 — EventEmitter, Worker Threads, child_process
 * Run: npm run 006
 */
const { EventEmitter } = require("events");
const { Worker } = require("worker_threads");
const { spawn } = require("child_process");
const path = require("path");
const { title, section, step, note, ok, warn } = require("../_shared/logger");

title("006 | Events, Process & Multiprocessing");

section("1) EventEmitter pub/sub");
const bus = new EventEmitter();
bus.on("order", (payload) => step("listener A got order", payload));
bus.once("order", (payload) => step("listener B (once)", payload));
bus.emit("order", { id: 1, total: 42 });
bus.emit("order", { id: 2, total: 99 });
ok("once() removed itself after first emit");

section("2) MaxListeners warning (leak signal)");
const leaky = new EventEmitter();
leaky.setMaxListeners(3);
for (let i = 0; i < 5; i++) {
  leaky.on("tick", () => {});
}
step("listenerCount('tick')", leaky.listenerCount("tick"));
warn("Repeated on() without off() → memory leak risk (MaxListenersExceededWarning)");

section("3) process.nextTick vs setImmediate priority");
const seq = [];
setImmediate(() => seq.push("immediate"));
process.nextTick(() => seq.push("nextTick"));
setTimeout(() => {
  step("priority demo", seq.join(" → "));
}, 10);

section("4) Worker Threads (CPU parallelism)");
const workerPath = path.join(__dirname, "worker.js");
const worker = new Worker(workerPath, { workerData: { n: 1e6 } });
worker.on("message", (msg) => {
  step("worker message", msg);

  section("5) child_process.spawn (separate OS process)");
  const child = spawn(process.execPath, ["-e", "console.log('child-pid=' + process.pid)"]);
  let out = "";
  child.stdout.on("data", (d) => (out += d.toString()));
  child.on("close", (code) => {
    step("child stdout", out.trim());
    step("child exit code", code);
    step("parent pid", process.pid);
    note("cluster module = multiple Node processes sharing a server port (not demoed to avoid multi-process hang)");

    section("6) Graceful shutdown sketch");
    step("On SIGTERM/SIGINT", "stop server.listen, drain requests, close DB, then exit");
    ok("Workers / child_process / cluster each solve different scale problems");
  });
});

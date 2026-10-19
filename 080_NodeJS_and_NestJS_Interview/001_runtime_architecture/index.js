/**
 * 001 — Node.js runtime & architecture
 * Run: npm run 001
 */
const os = require("os");
const fs = require("fs");
const { Worker } = require("worker_threads");
const path = require("path");
const { title, section, step, note, ok } = require("../_shared/logger");

title("001 | Node.js Runtime & Architecture");

section("1) Runtime facts (not a browser)");
step("process.versions.node", process.versions.node);
step("process.versions.v8", process.versions.v8);
step("typeof window", typeof window); // undefined in Node
step("typeof document", typeof document);
step("has fs module", typeof fs.readFile === "function");
step("has process.pid", process.pid);
ok("Node.js = V8 + libuv + system APIs (no DOM)");

section("2) Single JS thread + async I/O");
step("os.cpus().length (hardware cores)", os.cpus().length);
step("Main JS runs on one thread; I/O uses libuv thread pool");

const start = Date.now();
let finished = 0;

function mark(label) {
  finished += 1;
  step(`${label} finished`, `+${Date.now() - start}ms`);
  if (finished === 3) {
    ok("Three async I/O ops overlapped on one JS thread (concurrency)");
    demoCpuBlockVsWorker();
  }
}

// Concurrent non-blocking I/O (libuv)
fs.readFile(__filename, () => mark("readFile A"));
fs.readFile(__filename, () => mark("readFile B"));
setTimeout(() => mark("timer 20ms"), 20);

note("While I/O is pending, JS thread is free for other work.");

function demoCpuBlockVsWorker() {
  section("3) CPU-bound work blocks the Event Loop");

  const before = Date.now();
  let n = 0;
  for (let i = 0; i < 5e7; i++) n += i;
  step("Busy loop on main thread took", `${Date.now() - before}ms (sum=${n})`);
  warnBlock();

  section("4) Same CPU work in a Worker Thread (parallelism)");
  const workerFile = path.join(__dirname, "cpu-worker.js");
  const w = new Worker(workerFile, { workerData: { loops: 5e7 } });
  const t0 = Date.now();
  w.on("message", (msg) => {
    step("Worker result", msg);
    step("Worker wall time", `${Date.now() - t0}ms`);
    ok("Heavy CPU should leave the main Event Loop via Worker Threads / child_process / cluster");
  });
  w.on("error", (err) => console.error(err));
}

function warnBlock() {
  note("During that busy loop, timers/HTTP handlers on this process would stall.");
}

/**
 * 002 — Event Loop phases & scheduling priority
 * Run: npm run 002
 */
const fs = require("fs");
const { title, section, step, note, ok } = require("../_shared/logger");

title("002 | Event Loop & Task Queues");

section("1) Ordering: sync → nextTick → Promise → timers/immediate");
const order = [];

order.push("1-sync_1");

setTimeout(() => order.push("5-setTimeout-0"), 0);

setImmediate(() => order.push("6-setImmediate"));

process.nextTick(() => order.push("4-nextTick_1"));

Promise.resolve().then(() => order.push("6-promise-microtask_1"));

queueMicrotask(() => order.push("7-queueMicrotask_1"));

process.nextTick(() => order.push("5-nextTick_2"));

Promise.resolve().then(() => order.push("7-promise-microtask_2"));

queueMicrotask(() => order.push("8-queueMicrotask_2"));

order.push("2-sync_2");
order.push("3-sync_3");






setTimeout(() => {
  step("Observed order", order.join(" → "));
  note("Typical: sync → nextTick → promise → then timer/immediate (timer vs immediate can race at top level)");
  ok("Microtasks (nextTick/Promise) run before most macrotasks");
  demoInsideIO();
}, 30);

function demoInsideIO() {
  section("2) Inside an I/O callback: setImmediate usually beats setTimeout(0)");
  fs.readFile(__filename, () => {
    const ioOrder = [];
    setTimeout(() => ioOrder.push("timeout"), 0);
    setImmediate(() => ioOrder.push("immediate"));
    queueMicrotask(() => ioOrder.push("queueMicrotask"));
    Promise.resolve().then(() => ioOrder.push("promise"));
    process.nextTick(() => ioOrder.push("nextTick"));
    
    setTimeout(() => {
      step("Inside I/O callback order", ioOrder.join(" → "));
      note("Expected often: nextTick → promise → immediate → timeout");
      demoStarvation();
    }, 20);
  });
}

function demoStarvation() {
  section("3) nextTick starvation (limited recursion demo)");
  let count = 0;
  const max = 5;
  const stamp = [];

  function recurse() {
    count += 1;
    stamp.push(`nextTick#${count}`);
    if (count < max) process.nextTick(recurse);
  }

  setImmediate(() => stamp.push("immediate-after-nextTicks"));
  process.nextTick(recurse);

  setTimeout(() => {
    step("Sequence", stamp.join(" → "));
    note("All recursive nextTicks drain before setImmediate runs");
    warnLag();
  }, 20);
}

function warnLag() {
  section("4) Event Loop lag (blocked main thread)");
  const expected = 50;
  const scheduled = Date.now();
  // Block ~80ms
  const end = Date.now() + 800;
  while (Date.now() < end) {}

  setTimeout(() => {
    const actualDelay = Date.now() - scheduled;
    const lag = actualDelay - expected;
    step("Timer requested", `${expected}ms`);
    step("Timer actually fired after", `${actualDelay}ms`);
    step("Approx lag", `${Math.max(0, lag)}ms`);
    ok("Lag = blocked Event Loop → higher latency for everyone");
  }, expected);
}

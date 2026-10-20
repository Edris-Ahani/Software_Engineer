/**
 * 003 — Callbacks, Promises, async/await
 * Run: npm run 003
 */
const { title, section, step, note, ok, warn } = require("../_shared/logger");

title("003 | Async: Callbacks → Promises → async/await");

function delay(ms, value, shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`failed:${value}`));
      else resolve(value);
    }, ms);
  });
}

section("1) Callback hell shape (then the Promise rewrite)");
// Nested style (hard to read)
setTimeout(() => {
  step("callback level 1");
  setTimeout(() => {
    step("callback level 2");
    setTimeout(() => {
      step("callback level 3");
      ok("Flatten this with async/await");
      runPromiseCombinators();
    }, 10);
  }, 10);
}, 10);

async function runPromiseCombinators() {
  section("2) Promise.all / allSettled / race / any");

  try {
    const all = await Promise.all([delay(30, "A"), delay(20, "B")]);
    step("Promise.all success", all);
  } catch (e) {
    step("Promise.all error", e.message);
  }

  try {
    await Promise.all([delay(10, "ok"), delay(15, "boom", true)]);
  } catch (e) {
    step("Promise.all fail-fast", e.message);
  }

  const settled = await Promise.allSettled([
    delay(10, "ok"),
    delay(15, "boom", true),
  ]);
  step(
    "Promise.allSettled",
    settled.map((r) => (r.status === "fulfilled" ? r.value : `rejected:${r.reason.message}`))
  );

  const raced = await Promise.race([delay(40, "slow"), delay(10, "fast")]);
  step("Promise.race (first settled)", raced);

  try {
    const anyOk = await Promise.any([delay(20, "x", true), delay(15, "winner")]);
    step("Promise.any (first fulfilled)", anyOk);
  } catch (e) {
    step("Promise.any AggregateError", e.message);
  }

  try {
    await Promise.any([delay(5, "a", true), delay(8, "b", true)]);
  } catch (e) {
    step("Promise.any all failed", e.name,);
  }

  section("3) async function always returns a Promise");
  async function add(a, b) {
    return a + b; // becomes Promise.resolve(a+b)
  }
  const p = add(2, 3);
  step("add(2,3) instanceof Promise", p instanceof Promise);
  step("await add(2,3)", await p);

  section("4) Unhandled rejection vs try/catch");
  async function mayThrow() {
    throw new Error("async-boom");
  }

  mayThrow().catch((err) => {
    step("Caught rejected Promise from async throw", err.message);
  });

  try {
    await mayThrow();
  } catch (err) {
    step("try/catch around await", err.message);
  }

  section("5) Sequential await vs parallel start");
  const t1 = Date.now();
  await delay(40, 1);
  await delay(40, 2);
  step("Sequential two × 40ms ≈", `${Date.now() - t1}ms`);

  const t2 = Date.now();
  const p1 = delay(40, 1);
  const p2 = delay(40, 2);
  await Promise.all([p1, p2]);
  step("Parallel two × 40ms ≈", `${Date.now() - t2}ms`);
  ok("Start promises together, then await — do not await in a serial chain unless needed");
  note("If you forget .catch / await, Node emits unhandledRejection");
}

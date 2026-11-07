/** 017 — Bounded concurrency, settle-all ordering, and cooperative cancellation.
 * Run: npm run 017. Questions: 112–119, 209–210.
 */
const assert = require("node:assert/strict");
const { setTimeout: delay } = require("node:timers/promises");
const { title, section, step, ok } = require("../_shared/logger");

// Bounded active work; input and output still occupy O(n) memory.
// Policy: settle every item. A rejection does not cancel other items.
async function mapSettledLimit(items, limit, mapper) {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError("limit must be a positive integer");
  }
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      try {
        results[index] = { status: "fulfilled", value: await mapper(items[index], index) };
      } catch (reason) {
        results[index] = { status: "rejected", reason };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main() {
  title("017 | Async control with explicit guarantees");
  section("1) Three active workers; ordered outcomes including errors");
  let active = 0;
  let maxActive = 0;
  const results = await mapSettledLimit([1, 2, 3, 4, 5, 6], 3, async (value) => {
    active++;
    maxActive = Math.max(maxActive, active);
    try {
      await delay(2 * (7 - value));
      if (value === 4) throw new Error("item 4 failed");
      return value * 10;
    } finally {
      active--;
    }
  });
  assert.equal(maxActive, 3);
  assert.equal(active, 0);
  assert.deepEqual(results.map((r) => r.status), [
    "fulfilled", "fulfilled", "fulfilled", "rejected", "fulfilled", "fulfilled",
  ]);
  assert.deepEqual(results.map((r) => r.status === "fulfilled" ? r.value : r.reason.message),
    [10, 20, 30, "item 4 failed", 50, 60]);
  assert.deepEqual(await mapSettledLimit([], 3, () => 1), []);
  await assert.rejects(mapSettledLimit([1], 0, () => 1), RangeError);
  step("maximum active", maxActive);
  step("ordered outcomes", results);

  section("2) A race settles its wrapper; the losing work still runs");
  let finishSlow;
  let slowCompleted = false;
  const slow = new Promise((resolve) => { finishSlow = resolve; }).then(() => {
    slowCompleted = true;
    return "slow";
  });
  assert.equal(await Promise.race([Promise.resolve("fast"), slow]), "fast");
  assert.equal(slowCompleted, false);
  finishSlow();
  await slow;
  assert.equal(slowCompleted, true);
  step("losing operation completed after race", slowCompleted);

  section("3) Abort stops a supporting API; a deadline timer is cleaned up");
  const controller = new AbortController();
  const pending = delay(60_000, "unused", { signal: controller.signal });
  const rejection = assert.rejects(pending, { name: "AbortError" });
  controller.abort();
  await rejection;

  const deadlineController = new AbortController();
  const timeout = setTimeout(() => deadlineController.abort(), 5);
  try {
    await assert.rejects(delay(60_000, null, { signal: deadlineController.signal }), {
      name: "AbortError",
    });
  } finally {
    clearTimeout(timeout);
  }
  ok("Ordering, concurrency bound, failure handling, and cancellation verified");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

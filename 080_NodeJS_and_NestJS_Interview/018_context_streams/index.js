/** 018 — Isolated async context, slow-sink backpressure, split UTF-8 decoding.
 * Run: npm run 018. Questions: 120–123, 211.
 */
const assert = require("node:assert/strict");
const { AsyncLocalStorage } = require("node:async_hooks");
const { Readable, Transform, Writable } = require("node:stream");
const { pipeline } = require("node:stream/promises");
const { StringDecoder } = require("node:string_decoder");
const { setTimeout: delay } = require("node:timers/promises");
const { title, section, step, ok } = require("../_shared/logger");

async function main() {
  title("018 | Async context and streaming boundaries");
  section("1) Interleaved requests retain distinct correlation IDs");
  const context = new AsyncLocalStorage();
  async function request(id, wait) {
    return context.run({ requestId: id }, async () => {
      await delay(wait);
      const first = context.getStore().requestId;
      await delay(1);
      assert.equal(context.getStore().requestId, id);
      return first;
    });
  }
  try {
    const ids = await Promise.all([request("request-A", 8), request("request-B", 1)]);
    assert.deepEqual(ids, ["request-A", "request-B"]);
    assert.equal(context.getStore(), undefined);
    step("isolated contexts", ids);
  } finally {
    context.disable();
  }

  section("2) Pipeline coordinates a slow writable and a transform");
  const received = [];
  let backpressureCount = 0;
  const sink = new Writable({
    objectMode: true,
    highWaterMark: 1,
    write(value, _encoding, callback) {
      received.push(value);
      setTimeout(callback, 2);
    },
  });
  sink.on("drain", () => { backpressureCount++; });
  const double = new Transform({
    objectMode: true,
    highWaterMark: 1,
    transform(value, _encoding, callback) { callback(null, value * 2); },
  });
  await pipeline(Readable.from([1, 2, 3, 4, 5]), double, sink);
  assert.deepEqual(received, [2, 4, 6, 8, 10]);
  assert.ok(backpressureCount > 0);
  step("ordered values", received);
  step("drain events", backpressureCount);

  section("3) Stream errors reject pipeline and tear down resources");
  const broken = new Transform({
    objectMode: true,
    transform(_value, _encoding, callback) { callback(new Error("transform failed")); },
  });
  const discard = new Writable({ objectMode: true, write(_v, _e, cb) { cb(); } });
  await assert.rejects(pipeline(Readable.from([1]), broken, discard), /transform failed/);
  assert.equal(broken.destroyed, true);
  assert.equal(discard.destroyed, true);

  section("4) A UTF-8 character split between chunks");
  const bytes = Buffer.from("سلام🙂", "utf8");
  const chunks = [bytes.subarray(0, 1), bytes.subarray(1, 9), bytes.subarray(9)];
  const unsafe = chunks.map((chunk) => chunk.toString("utf8")).join("");
  const decoder = new StringDecoder("utf8");
  const safe = chunks.map((chunk) => decoder.write(chunk)).join("") + decoder.end();
  assert.notEqual(unsafe, "سلام🙂");
  assert.equal(safe, "سلام🙂");
  step("independent decoding", unsafe);
  step("stateful decoding", safe);
  ok("Context isolation, backpressure, teardown, and byte boundaries verified");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

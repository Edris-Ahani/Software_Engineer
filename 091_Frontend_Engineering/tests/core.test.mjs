import test from "node:test";
import assert from "node:assert/strict";
import { taskReducer, decodeTasks, encodeTasks, validateTasks, TASK_LIMIT } from "../lib/tasks.mjs";
import { cartTotal, products, searchProducts } from "../lib/products.mjs";
import { fetchJson, HttpError, createLatestRequest, validateProductPayload } from "../lib/http.mjs";
test("money validates safe integers and rejects invalid totals", () => {
  assert.equal(cartTotal([{ priceCents: 4500, quantity: 2 }, { priceCents: 700, quantity: 1 }]), 9700);
  assert.equal(cartTotal([]), 0);
  for (const value of [-1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => cartTotal([{ priceCents: value, quantity: 1 }]));
  }
  assert.throws(() => cartTotal([{ priceCents: Number.MAX_SAFE_INTEGER, quantity: 2 }]), RangeError);
});
test("search trims and ignores case without mutating data", () => {
  assert.deepEqual(searchProducts(products, " KEYBOARD ").map(item => item.id), ["keyboard"]);
  assert.equal(searchProducts(products, "nothing").length, 0);
  assert.equal(searchProducts(products, "").length, 3);
});
test("task transitions preserve earlier state and reject invalid additions atomically", () => {
  const original = [{ id: "one", title: "Review", done: false }];
  const next = taskReducer(original, { type: "toggle", id: "one" });
  assert.equal(next[0].done, true); assert.equal(original[0].done, false);
  assert.notEqual(next[0], original[0]);
  for (const title of [" ", "x".repeat(121)]) {
    assert.throws(() => taskReducer(original, { type: "add", id: "two", title }));
  }
  assert.throws(() => taskReducer(original, { type: "add", id: "one", title: "Duplicate" }));
  assert.deepEqual(original, [{ id: "one", title: "Review", done: false }]);
  assert.deepEqual(taskReducer(original, { type: "remove", id: "one" }), []);
});
test("persistence rejects malformed schemas, duplicates, and excess records", () => {
  const tasks = [{ id: "one", title: "Review", done: true }];
  assert.deepEqual(decodeTasks(encodeTasks(tasks)), tasks); assert.deepEqual(decodeTasks(null), []);
  for (const raw of ["{", "null", '{"version":2,"tasks":[]}', '{"version":1,"tasks":[{}]}']) {
    assert.throws(() => decodeTasks(raw));
  }
  assert.throws(() => validateTasks([...tasks, ...tasks]));
  assert.throws(() => validateTasks(Array.from({ length: TASK_LIMIT + 1 }, (_, id) =>
    ({ id: String(id), title: "Task", done: false }))));
});
test("fetch rejects HTTP failures, malformed JSON, invalid data, and aborted signals", async () => {
  await assert.rejects(fetchJson("unused", { fetcher: async () => new Response("{}", { status: 404 }) }),
    error => error instanceof HttpError && error.status === 404);
  await assert.rejects(fetchJson("unused", { fetcher: async () => new Response("{") }), SyntaxError);
  assert.throws(() => validateProductPayload([{ id: "a", name: "A", priceCents: -1 }]));
  assert.throws(() => validateProductPayload([null]));
  assert.deepEqual(validateProductPayload([{ id: "a", name: "A", priceCents: 0 }]),
    [{ id: "a", name: "A", priceCents: 0 }]);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(fetchJson("unused", {
    signal: controller.signal,
    fetcher: async (_url, options) => { options.signal.throwIfAborted(); return new Response("[]"); },
  }), { name: "AbortError" });
});
test("new request cancels the old one and rejects reverse completion", async () => {
  const owner = createLatestRequest(); const first = owner.begin(); const second = owner.begin();
  const applied = [];
  await Promise.resolve().then(() => { if (second.isCurrent()) applied.push("new"); });
  await Promise.resolve().then(() => { if (first.isCurrent()) applied.push("old"); });
  assert.equal(first.signal.aborted, true); assert.deepEqual(applied, ["new"]);
  owner.dispose(); assert.equal(second.signal.aborted, true); assert.equal(second.isCurrent(), false);
});

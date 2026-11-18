import { test, expect } from "@playwright/test";
import { listenLab } from "../../scripts/serve.mjs";
let server; let base;
test.beforeAll(async () => {
  server = await listenLab(0); base = "http://127.0.0.1:" + server.address().port;
});
test.afterAll(async () => {
  server.closeAllConnections();
  await new Promise((accept, reject) => server.close(error => error ? reject(error) : accept()));
});
test("catalog search survives reload and history navigation", async ({ page }) => {
  await page.goto(base + "/projects/001_accessible_catalog/index.html");
  await page.getByLabel("Product search").fill("keyboard");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Keyboard", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("1 products found");
  await page.reload(); await expect(page.getByLabel("Product search")).toHaveValue("keyboard");
  await page.getByLabel("Product search").fill("monitor");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.goBack(); await expect(page.getByLabel("Product search")).toHaveValue("keyboard");
});
test("board persists literal untrusted titles and restores focus", async ({ page }) => {
  await page.goto(base + "/projects/002_persistent_board/index.html");
  const title = "<img src=x onerror=alert(1)>";
  await page.getByLabel("Task title").fill(title);
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(page.locator("#tasks img")).toHaveCount(0);
  await page.getByRole("button", { name: "Complete " + title, exact: true }).click();
  await expect(page.getByRole("button", { name: "Reopen " + title, exact: true })).toBeFocused();
  await page.reload(); await expect(page.locator("#summary")).toHaveText("1 of 1 completed");
  await page.getByRole("button", { name: "Remove " + title, exact: true }).click();
  await expect(page.getByLabel("Task title")).toBeFocused();
});
test("corrupt saved data survives until explicit reset", async ({ page }) => {
  await page.goto(base + "/projects/002_persistent_board/index.html");
  await page.evaluate(() => localStorage.setItem("frontend-board-v1", "{broken"));
  await page.reload(); await expect(page.getByRole("status")).toContainText("Working in memory");
  await page.getByLabel("Task title").fill("Memory only");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("frontend-board-v1"))).toBe("{broken");
  await page.getByRole("button", { name: "Discard unreadable saved data and reset" }).click();
  await expect(page.locator("#tasks li")).toHaveCount(0);
});
test("narrow layout does not overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(base + "/examples/002_responsive_layout.html");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test("fetch demo distinguishes success from failure", async ({ page }) => {
  await page.goto(base + "/examples/009_fetch.html");
  await page.getByRole("button", { name: "Load products" }).click();
  await expect(page.getByRole("status")).toHaveText("3 products loaded");
  await page.getByRole("button", { name: "Simulate 503" }).click();
  await expect(page.getByRole("status")).toContainText("HTTP 503");
});
test("worker returns the bounded sum", async ({ page }) => {
  await page.goto(base + "/examples/012_worker.html");
  await page.getByRole("button", { name: "Sum 1 to 1000000" }).click();
  await expect(page.getByRole("status")).toHaveText("Sum: 500000500000");
});
test("SSE closes after three events", async ({ page }) => {
  await page.goto(base + "/examples/019_sse.html");
  await page.getByRole("button", { name: "Receive three events" }).click();
  await expect(page.getByRole("status")).toHaveText("Completed and closed");
  await expect(page.locator("#events li")).toHaveCount(3);
});
test("React production artifact supports adding and filtering", async ({ page }) => {
  await page.goto(base + "/projects/003_react_dashboard/dist/index.html");
  await page.getByLabel("Task title").fill("Typed new task");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(page.getByLabel("Typed new task")).toBeVisible();
  await page.getByLabel("Show tasks").selectOption("done");
  await expect(page.getByLabel("Typed new task")).toHaveCount(0);
  await expect(page.getByLabel("Measure interaction latency")).toBeVisible();
});

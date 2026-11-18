import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", timeout: 20_000, workers: 1,
  use: { headless: true, viewport: { width: 1000, height: 800 } },
});

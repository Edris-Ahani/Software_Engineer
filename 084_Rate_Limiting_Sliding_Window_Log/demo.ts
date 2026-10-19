/**
 * Run: npm start
 * Demo: limit=3 per rolling 1000ms — exact sliding behavior via fake clock.
 */
import { SlidingWindowLog } from "./SlidingWindowLog";

function line(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

function main(): void {
  line("084 | Sliding Window Log");

  let fakeNow = 0;
  const limiter = new SlidingWindowLog({
    limit: 3,
    windowMs: 1000,
    now: () => fakeNow,
  });

  console.log("Config: limit=3 requests in any rolling 1000ms window");

  const events = [
    { t: 0, label: "first" },
    { t: 200, label: "second" },
    { t: 400, label: "third" },
    { t: 600, label: "fourth (should deny)" },
    { t: 1001, label: "after oldest expired (should allow)" },
    { t: 1100, label: "still within window of recent ones" },
    { t: 1200, label: "may deny again if 3 still in window" },
  ];

  for (const event of events) {
    fakeNow = event.t;
    const r = limiter.tryConsume();
    console.log(
      `  t=${String(event.t).padStart(4)} ${event.label.padEnd(40)} allowed=${r.allowed} count=${r.count} remaining=${r.remaining} retryAfterMs=${r.retryAfterMs}`
    );
  }

  console.log("\n✓ Precise sliding window; stores every request timestamp.");
}

main();

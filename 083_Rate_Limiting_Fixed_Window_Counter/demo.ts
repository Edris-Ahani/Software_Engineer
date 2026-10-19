/**
 * Run: npm start
 * Demo: limit=3 per 1000ms fixed window + boundary-burst illustration with fake clock.
 */
import { FixedWindowCounter } from "./FixedWindowCounter";

function line(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

function main(): void {
  line("083 | Fixed Window Counter");

  let fakeNow = 10_000;
  const limiter = new FixedWindowCounter({
    limit: 3,
    windowMs: 1000,
    now: () => fakeNow,
  });

  console.log("Config: limit=3 requests / 1000ms window");
  console.log("\n--- Window A (t=10000..10999) ---");

  for (let i = 1; i <= 4; i++) {
    const r = limiter.tryConsume();
    console.log(
      `  t=${fakeNow} #${i} allowed=${r.allowed} count=${r.count} remaining=${r.remaining} retryAfterMs=${r.retryAfterMs}`
    );
  }

  console.log("\n--- Jump to next window (t=11000) — counter resets ---");
  fakeNow = 11_000;
  for (let i = 1; i <= 3; i++) {
    const r = limiter.tryConsume();
    console.log(`  t=${fakeNow} #${i} allowed=${r.allowed} count=${r.count}`);
  }

  console.log("\n--- Boundary burst demo (separate limiter) ---");
  console.log("If a client sends `limit` at end of W1 and `limit` at start of W2,");
  console.log("they get ~2× limit in a short real-time span.");

  let t = 19_900;
  const edge = new FixedWindowCounter({
    limit: 3,
    windowMs: 1000,
    now: () => t,
  });

  for (let i = 1; i <= 3; i++) {
    const r = edge.tryConsume();
    console.log(`  end of W1 t=${t} allowed=${r.allowed} count=${r.count}`);
  }

  t = 20_000; // new window
  for (let i = 1; i <= 3; i++) {
    const r = edge.tryConsume();
    console.log(`  start of W2 t=${t} allowed=${r.allowed} count=${r.count}`);
  }

  console.log("\n✓ Simple & cheap; watch for boundary bursts near window edges.");
}

main();

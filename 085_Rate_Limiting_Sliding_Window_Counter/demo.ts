/**
 * Run: npm start
 * Demo: weighted previous+current counters approximate a sliding window.
 */
import { SlidingWindowCounter } from "./SlidingWindowCounter";

function line(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

function main(): void {
  line("085 | Sliding Window Counter");

  let fakeNow = 0;
  const limiter = new SlidingWindowCounter({
    limit: 5,
    windowMs: 1000,
    now: () => fakeNow,
  });

  console.log("Config: limit=5, windowMs=1000");
  console.log("estimated = previousCount * (1 - elapsedRatio) + currentCount");

  console.log("\n--- Fill previous window (t=0..999) with 4 requests ---");
  for (let i = 1; i <= 4; i++) {
    fakeNow = i * 100;
    const r = limiter.tryConsume();
    console.log(
      `  t=${fakeNow} allowed=${r.allowed} estimated=${r.estimated.toFixed(2)} curr=${r.currentCount} prev=${r.previousCount}`
    );
  }

  console.log("\n--- New window early (t=1000): previous still weighs heavily ---");
  fakeNow = 1000;
  let r = limiter.tryConsume();
  console.log(
    `  t=${fakeNow} allowed=${r.allowed} estimated=${r.estimated.toFixed(2)} curr=${r.currentCount} prev=${r.previousCount} elapsedRatio=${r.elapsedRatio.toFixed(2)}`
  );

  console.log("\n--- Mid window (t=1500): previous weight drops to ~50% ---");
  fakeNow = 1500;
  r = limiter.tryConsume();
  console.log(
    `  t=${fakeNow} allowed=${r.allowed} estimated=${r.estimated.toFixed(2)} curr=${r.currentCount} prev=${r.previousCount} elapsedRatio=${r.elapsedRatio.toFixed(2)}`
  );

  console.log("\n--- Late window (t=1900): previous weight ~10% ---");
  fakeNow = 1900;
  for (let i = 1; i <= 4; i++) {
    r = limiter.tryConsume();
    console.log(
      `  t=${fakeNow} #${i} allowed=${r.allowed} estimated=${r.estimated.toFixed(2)} remaining=${r.remaining.toFixed(2)}`
    );
  }

  console.log("\n✓ Cheaper than a full log; smoother than a plain fixed window.");
}

main();

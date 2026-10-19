/**
 * Run: npm start
 * Demo: capacity=5, refill=2 tokens/sec — shows burst then steady refill.
 */
import { TokenBucket } from "./TokenBucket";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function line(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

async function main(): Promise<void> {
  line("081 | Token Bucket");

  const bucket = new TokenBucket({
    capacity: 5,
    refillRatePerSecond: 2,
  });

  console.log("Config: capacity=5, refillRate=2 tokens/sec");
  console.log("\n--- Burst: 7 rapid requests ---");

  for (let i = 1; i <= 7; i++) {
    const result = bucket.tryConsume();
    console.log(
      `  #${i} allowed=${result.allowed} tokens=${result.tokens.toFixed(2)} retryAfterMs=${result.retryAfterMs}`
    );
  }

  console.log("\n--- Wait 1500ms (≈3 tokens refill, capped by capacity) ---");
  await sleep(1500);

  for (let i = 1; i <= 4; i++) {
    const result = bucket.tryConsume();
    console.log(
      `  after-wait #${i} allowed=${result.allowed} tokens=${result.tokens.toFixed(2)}`
    );
  }

  console.log("\n✓ Burst allowed up to capacity; then limited by refill rate.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

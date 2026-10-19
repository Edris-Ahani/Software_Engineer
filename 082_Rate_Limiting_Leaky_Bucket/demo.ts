/**
 * Run: npm start
 * Demo: capacity=5, leak=2/sec — queue fills, then leaks steadily.
 */
import { LeakyBucket } from "./LeakyBucket";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function line(title: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(`  ${title}`);
  console.log("=".repeat(60));
}

async function main(): Promise<void> {
  line("082 | Leaky Bucket");

  const bucket = new LeakyBucket({
    capacity: 5,
    leakRatePerSecond: 2,
  });

  console.log("Config: capacity=5, leakRate=2 units/sec");
  console.log("\n--- Admit 7 rapid requests ---");

  for (let i = 1; i <= 7; i++) {
    const result = bucket.tryAdmit();
    console.log(
      `  #${i} allowed=${result.allowed} level=${result.level.toFixed(2)} retryAfterMs=${result.retryAfterMs}`
    );
  }

  console.log("\n--- Wait 2000ms (≈4 units leak) ---");
  await sleep(2000);
  console.log(`  waterLevel after wait: ${bucket.waterLevel.toFixed(2)}`);

  for (let i = 1; i <= 3; i++) {
    const result = bucket.tryAdmit();
    console.log(
      `  after-wait #${i} allowed=${result.allowed} level=${result.level.toFixed(2)}`
    );
  }

  console.log("\n✓ Traffic is smoothed by a constant leak rate; excess is dropped.");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

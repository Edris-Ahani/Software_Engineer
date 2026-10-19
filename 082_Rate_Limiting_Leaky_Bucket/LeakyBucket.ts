/**
 * Leaky Bucket rate limiter (as a queue / water level).
 *
 * Requests increase the water level. Water leaks at a constant rate.
 * If a request would exceed capacity, it is rejected.
 * Unlike Token Bucket, this enforces a smoother outbound rate (no large bursts
 * beyond what fits in the remaining capacity at arrival time).
 */
export interface LeakyBucketOptions {
  capacity: number;
  leakRatePerSecond: number;
  now?: () => number;
}

export interface LeakResult {
  allowed: boolean;
  level: number;
  retryAfterMs: number;
}

export class LeakyBucket {
  private readonly capacity: number;
  private readonly leakRatePerSecond: number;
  private readonly now: () => number;

  private level = 0;
  private lastLeakMs: number;

  constructor(options: LeakyBucketOptions) {
    if (options.capacity <= 0) {
      throw new Error("capacity must be > 0");
    }
    if (options.leakRatePerSecond <= 0) {
      throw new Error("leakRatePerSecond must be > 0");
    }

    this.capacity = options.capacity;
    this.leakRatePerSecond = options.leakRatePerSecond;
    this.now = options.now ?? (() => Date.now());
    this.lastLeakMs = this.now();
  }

  get waterLevel(): number {
    this.leak();
    return this.level;
  }

  tryAdmit(size = 1): LeakResult {
    if (size <= 0) {
      throw new Error("size must be > 0");
    }

    this.leak();

    if (this.level + size <= this.capacity) {
      this.level += size;
      return { allowed: true, level: this.level, retryAfterMs: 0 };
    }

    const overflow = this.level + size - this.capacity;
    const retryAfterMs = Math.ceil((overflow / this.leakRatePerSecond) * 1000);
    return { allowed: false, level: this.level, retryAfterMs };
  }

  private leak(): void {
    const now = this.now();
    const elapsedMs = Math.max(0, now - this.lastLeakMs);
    if (elapsedMs === 0) {
      return;
    }

    const leaked = (elapsedMs / 1000) * this.leakRatePerSecond;
    this.level = Math.max(0, this.level - leaked);
    this.lastLeakMs = now;
  }
}

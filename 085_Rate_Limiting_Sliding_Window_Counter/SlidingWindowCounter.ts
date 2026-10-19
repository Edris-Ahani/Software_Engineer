/**
 * Sliding Window Counter rate limiter.
 *
 * Approximates a sliding window using two fixed-window counters:
 * previous window count + current window count, weighted by how far
 * we are into the current window:
 *
 *   estimated = previousCount * (1 - elapsedRatio) + currentCount
 *
 * Pros: nearly sliding accuracy without storing every timestamp.
 * Cons: approximation (can be slightly stricter/looser than a true log).
 */
export interface SlidingWindowCounterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface SlidingWindowCounterResult {
  allowed: boolean;
  estimated: number;
  currentCount: number;
  previousCount: number;
  remaining: number;
  retryAfterMs: number;
  elapsedRatio: number;
}

export class SlidingWindowCounter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  private windowStartMs: number;
  private currentCount = 0;
  private previousCount = 0;

  constructor(options: SlidingWindowCounterOptions) {
    if (options.limit <= 0) {
      throw new Error("limit must be > 0");
    }
    if (options.windowMs <= 0) {
      throw new Error("windowMs must be > 0");
    }

    this.limit = options.limit;
    this.windowMs = options.windowMs;
    this.now = options.now ?? (() => Date.now());
    this.windowStartMs = this.align(this.now());
  }

  tryConsume(): SlidingWindowCounterResult {
    this.rotateIfNeeded();

    const now = this.now();
    const elapsedRatio = Math.min(
      1,
      Math.max(0, (now - this.windowStartMs) / this.windowMs)
    );
    const estimatedIfAllowed =
      this.previousCount * (1 - elapsedRatio) + this.currentCount + 1;

    if (estimatedIfAllowed <= this.limit) {
      this.currentCount += 1;
      return {
        allowed: true,
        estimated: estimatedIfAllowed,
        currentCount: this.currentCount,
        previousCount: this.previousCount,
        remaining: Math.max(0, this.limit - estimatedIfAllowed),
        retryAfterMs: 0,
        elapsedRatio,
      };
    }

    const estimated =
      this.previousCount * (1 - elapsedRatio) + this.currentCount;
    const neededDrop = estimatedIfAllowed - this.limit;
    const retryAfterMs =
      this.previousCount > 0
        ? Math.ceil((neededDrop / this.previousCount) * this.windowMs)
        : Math.max(0, this.windowStartMs + this.windowMs - now);

    return {
      allowed: false,
      estimated,
      currentCount: this.currentCount,
      previousCount: this.previousCount,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
      elapsedRatio,
    };
  }

  private rotateIfNeeded(): void {
    const now = this.now();
    const aligned = this.align(now);

    if (aligned === this.windowStartMs) {
      return;
    }

    // If we skipped one or more full windows, previous becomes 0.
    const windowsPassed = Math.floor(
      (aligned - this.windowStartMs) / this.windowMs
    );

    if (windowsPassed === 1) {
      this.previousCount = this.currentCount;
    } else {
      this.previousCount = 0;
    }

    this.currentCount = 0;
    this.windowStartMs = aligned;
  }

  private align(timestampMs: number): number {
    return Math.floor(timestampMs / this.windowMs) * this.windowMs;
  }
}

/**
 * Fixed Window Counter rate limiter.
 *
 * Counts requests inside a fixed time window [start, start + windowMs).
 * When the clock crosses into a new window, the counter resets to 0.
 *
 * Pros: simple and cheap.
 * Cons: boundary burst — up to 2× limit around window edges.
 */
export interface FixedWindowCounterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface FixedWindowResult {
  allowed: boolean;
  count: number;
  remaining: number;
  windowStartsAtMs: number;
  windowEndsAtMs: number;
  retryAfterMs: number;
}

export class FixedWindowCounter {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  private windowStartMs: number;
  private count = 0;

  constructor(options: FixedWindowCounterOptions) {
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

  tryConsume(): FixedWindowResult {
    const now = this.now();
    const aligned = this.align(now);

    if (aligned !== this.windowStartMs) {
      this.windowStartMs = aligned;
      this.count = 0;
    }

    const windowEndsAtMs = this.windowStartMs + this.windowMs;

    if (this.count < this.limit) {
      this.count += 1;
      return {
        allowed: true,
        count: this.count,
        remaining: this.limit - this.count,
        windowStartsAtMs: this.windowStartMs,
        windowEndsAtMs,
        retryAfterMs: 0,
      };
    }

    return {
      allowed: false,
      count: this.count,
      remaining: 0,
      windowStartsAtMs: this.windowStartMs,
      windowEndsAtMs,
      retryAfterMs: Math.max(0, windowEndsAtMs - now),
    };
  }

  private align(timestampMs: number): number {
    return Math.floor(timestampMs / this.windowMs) * this.windowMs;
  }
}

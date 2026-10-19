/**
 * Sliding Window Log rate limiter.
 *
 * Keeps a log (timestamps) of every accepted request.
 * On each check, drops timestamps older than `windowMs`, then
 * allows the request only if remaining log size < limit.
 *
 * Pros: accurate sliding window.
 * Cons: memory/CPU grow with request volume (stores every timestamp).
 */
export interface SlidingWindowLogOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export interface SlidingWindowLogResult {
  allowed: boolean;
  count: number;
  remaining: number;
  retryAfterMs: number;
  oldestInWindowMs: number | null;
}

export class SlidingWindowLog {
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;
  private readonly timestamps: number[] = [];

  constructor(options: SlidingWindowLogOptions) {
    if (options.limit <= 0) {
      throw new Error("limit must be > 0");
    }
    if (options.windowMs <= 0) {
      throw new Error("windowMs must be > 0");
    }

    this.limit = options.limit;
    this.windowMs = options.windowMs;
    this.now = options.now ?? (() => Date.now());
  }

  tryConsume(): SlidingWindowLogResult {
    const now = this.now();
    this.evict(now);

    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now);
      return {
        allowed: true,
        count: this.timestamps.length,
        remaining: this.limit - this.timestamps.length,
        retryAfterMs: 0,
        oldestInWindowMs: this.timestamps[0] ?? null,
      };
    }

    const oldest = this.timestamps[0];
    const retryAfterMs = Math.max(0, oldest + this.windowMs - now);

    return {
      allowed: false,
      count: this.timestamps.length,
      remaining: 0,
      retryAfterMs,
      oldestInWindowMs: oldest,
    };
  }

  /** Current number of requests still inside the sliding window. */
  get size(): number {
    this.evict(this.now());
    return this.timestamps.length;
  }

  private evict(now: number): void {
    const threshold = now - this.windowMs;
    while (this.timestamps.length > 0 && this.timestamps[0] <= threshold) {
      this.timestamps.shift();
    }
  }
}

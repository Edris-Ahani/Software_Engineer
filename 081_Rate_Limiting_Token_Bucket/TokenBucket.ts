/**
 * Token Bucket rate limiter.
 *
 * Tokens refill continuously at `refillRatePerSecond`.
 * Each allowed request consumes `cost` tokens (default 1).
 * Bursts are allowed up to `capacity`.
 */
export interface TokenBucketOptions {
  capacity: number;
  refillRatePerSecond: number;
  /** Optional clock for tests (milliseconds). */
  now?: () => number;
}

export interface ConsumeResult {
  allowed: boolean;
  tokens: number;
  retryAfterMs: number;
}

export class TokenBucket {
  private readonly capacity: number;
  private readonly refillRatePerSecond: number;
  private readonly now: () => number;

  private tokens: number;
  private lastRefillMs: number;

  constructor(options: TokenBucketOptions) {
    if (options.capacity <= 0) {
      throw new Error("capacity must be > 0");
    }
    if (options.refillRatePerSecond <= 0) {
      throw new Error("refillRatePerSecond must be > 0");
    }

    this.capacity = options.capacity;
    this.refillRatePerSecond = options.refillRatePerSecond;
    this.now = options.now ?? (() => Date.now());
    this.tokens = options.capacity;
    this.lastRefillMs = this.now();
  }

  get availableTokens(): number {
    this.refill();
    return this.tokens;
  }

  tryConsume(cost = 1): ConsumeResult {
    if (cost <= 0) {
      throw new Error("cost must be > 0");
    }

    this.refill();

    if (this.tokens >= cost) {
      this.tokens -= cost;
      return { allowed: true, tokens: this.tokens, retryAfterMs: 0 };
    }

    const missing = cost - this.tokens;
    const retryAfterMs = Math.ceil((missing / this.refillRatePerSecond) * 1000);
    return { allowed: false, tokens: this.tokens, retryAfterMs };
  }

  private refill(): void {
    const now = this.now();
    const elapsedMs = Math.max(0, now - this.lastRefillMs);
    if (elapsedMs === 0) {
      return;
    }

    const added = (elapsedMs / 1000) * this.refillRatePerSecond;
    this.tokens = Math.min(this.capacity, this.tokens + added);
    this.lastRefillMs = now;
  }
}

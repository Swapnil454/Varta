// In-memory rate limiter with sliding window
// For production, consider using Redis for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetAt <= now) {
        this.store.delete(key);
      }
    }
  }

  check(key: string, config: RateLimitConfig): {
    allowed: boolean;
    remaining: number;
    resetAt: number;
    retryAfter?: number;
  } {
    const now = Date.now();
    const entry = this.store.get(key);

    // If no entry or window expired, create new entry
    if (!entry || entry.resetAt <= now) {
      const resetAt = now + config.windowMs;
      this.store.set(key, { count: 1, resetAt });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetAt,
      };
    }

    // Check if under limit
    if (entry.count < config.maxRequests) {
      entry.count++;
      return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
      };
    }

    // Rate limited
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  // Reset rate limit for a key (useful after successful verification)
  reset(key: string) {
    this.store.delete(key);
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

// Pre-configured rate limiters for different use cases
export const rateLimits = {
  // Forgot password: 3 requests per 5 minutes per email
  forgotPassword: (email: string) =>
    rateLimiter.check(`forgot:${email.toLowerCase()}`, {
      windowMs: 5 * 60 * 1000,
      maxRequests: 3,
    }),

  // Send OTP: 3 requests per 5 minutes per email
  sendOtp: (email: string) =>
    rateLimiter.check(`otp:${email.toLowerCase()}`, {
      windowMs: 5 * 60 * 1000,
      maxRequests: 3,
    }),

  // Login attempts: 5 per 15 minutes per IP
  login: (ip: string) =>
    rateLimiter.check(`login:${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    }),

  // Registration: 3 per hour per IP
  register: (ip: string) =>
    rateLimiter.check(`register:${ip}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 3,
    }),

  // Generic rate limit per IP
  perIp: (ip: string, action: string, windowMs: number, maxRequests: number) =>
    rateLimiter.check(`${action}:${ip}`, { windowMs, maxRequests }),
};

// Helper to extract IP from request
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

// Reset helpers
export const resetRateLimit = {
  forgotPassword: (email: string) =>
    rateLimiter.reset(`forgot:${email.toLowerCase()}`),
  sendOtp: (email: string) =>
    rateLimiter.reset(`otp:${email.toLowerCase()}`),
  login: (ip: string) =>
    rateLimiter.reset(`login:${ip}`),
};

export default rateLimiter;

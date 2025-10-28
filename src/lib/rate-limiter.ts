import { NextRequest, NextResponse } from "next/server";

// In-memory store for rate limiting
// In a production environment, you might want to use Redis or another distributed solution
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

interface RateLimiterOptions {
  limit: number; // Maximum number of requests allowed
  windowMs: number; // Time window in milliseconds
  message?: string; // Custom error message
}

// Default options
const defaultOptions: RateLimiterOptions = {
  limit: 5,
  windowMs: 60 * 1000, // 1 minute
  message: "Too many login attempts. Please try again later.",
};

/**
 * Rate limiter middleware for Next.js API routes
 * Limits requests based on IP address
 * @param req - Next.js request object
 * @param options - Rate limiter options
 * @returns NextResponse if rate limit is exceeded, null otherwise
 */
export function rateLimiter(
  req: NextRequest,
  options: Partial<RateLimiterOptions> = {}
): NextResponse | null {
  const opts = { ...defaultOptions, ...options };
  // Get IP from headers or connection info
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const now = Date.now();

  // Get or initialize rate limit data for this IP
  const ipData = ipRequestCounts.get(ip) || {
    count: 0,
    resetTime: now + opts.windowMs,
  };

  // Reset count if the time window has passed
  if (now > ipData.resetTime) {
    ipData.count = 0;
    ipData.resetTime = now + opts.windowMs;
  }

  // Increment request count
  ipData.count++;
  ipRequestCounts.set(ip, ipData);

  // Set headers with rate limit information
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", opts.limit.toString());
  headers.set(
    "X-RateLimit-Remaining",
    Math.max(0, opts.limit - ipData.count).toString()
  );
  headers.set(
    "X-RateLimit-Reset",
    Math.ceil(ipData.resetTime / 1000).toString()
  );

  // Check if rate limit is exceeded
  if (ipData.count > opts.limit) {
    return NextResponse.json(
      {
        success: false,
        message: opts.message,
        error: "rate_limit_exceeded",
      },
      {
        status: 429, // Too Many Requests
        headers,
      }
    );
  }

  return null;
}

// Helper to clean up old rate limit entries (can be called periodically)
export function cleanupRateLimiter(): void {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}

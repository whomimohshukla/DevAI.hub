import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth";

// Simple in-memory rate limiter: X requests per minute per API key
// For production, replace with Redis-based sliding window.
const windowMs = 60 * 1000;
const maxPerMinute = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "60", 10);

type Counter = { count: number; windowStart: number };
const buckets = new Map<string, Counter>();

export function basicRateLimit(req: AuthedRequest, res: Response, next: NextFunction) {
  const apiKeyId = req.apiKeyDoc?._id?.toString();
  if (!apiKeyId) return res.status(401).json({ error: "Unauthenticated" });

  const now = Date.now();
  const key = apiKeyId;
  const entry = buckets.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count < maxPerMinute) {
    entry.count += 1;
    return next();
  }

  const retryAfter = Math.ceil((entry.windowStart + windowMs - now) / 1000);
  res.setHeader("Retry-After", retryAfter.toString());
  return res.status(429).json({ error: "Rate limit exceeded", retryAfter });
}

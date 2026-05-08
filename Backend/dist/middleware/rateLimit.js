"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicRateLimit = basicRateLimit;
const windowMs = 60 * 1000;
const maxPerMinute = parseInt(process.env.RATE_LIMIT_PER_MINUTE || "60", 10);
const buckets = new Map();
function basicRateLimit(req, res, next) {
    const apiKeyId = req.apiKeyDoc?._id?.toString();
    if (!apiKeyId)
        return res.status(401).json({ error: "Unauthenticated" });
    const now = Date.now();
    const entry = buckets.get(apiKeyId);
    if (!entry || now - entry.windowStart >= windowMs) {
        buckets.set(apiKeyId, { count: 1, windowStart: now });
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

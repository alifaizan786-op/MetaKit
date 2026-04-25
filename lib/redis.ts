// lib/redis.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Redis client — reads from env, connects over HTTPS to Upstash
export const redis = new Redis({
	url: process.env.UPSTASH_REDIS_REST_URL!,
	token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter — 20 requests per IP per 24 hours
// slidingWindow is more accurate than fixed window for abuse prevention
export const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.slidingWindow(20, '86400 s'),
	prefix: 'metakit:ratelimit', // namespaces keys so they don't collide with cache keys
});

// Cache config
export const CACHE_TTL = 60 * 60 * 24; // 24 hours
export const CACHE_PREFIX = 'metakit:audit:'; // cache key will be metakit:audit:https://github.com

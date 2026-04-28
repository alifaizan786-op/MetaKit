// app/api/audit/route.ts
import { parseMetaTags } from '@/lib/metaParser';
import connectDB from '@/lib/mongodb';
import { CACHE_PREFIX, CACHE_TTL, ratelimit, redis } from '@/lib/redis';
import Audit from '@/models/Audit';

export async function GET(req: Request) {
	// Check if user has hit the limit of requests, before continuing
	const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
	const rateLimitCheck = await ratelimit.limit(ip);
	const resetDate = new Date(rateLimitCheck.reset);

	// Enforce the rate limiter
	// Skip rate limiting in development
	if (!rateLimitCheck.success && process.env.NODE_ENV !== 'development') {
		return Response.json(
			{
				error: `You have hit the limit of requests ${rateLimitCheck.remaining}/${rateLimitCheck.limit}. The limit will reset on ${resetDate}. Please try again later`,
			},
			{ status: 429 },
		);
	}

	const { searchParams } = new URL(req.url);
	const url = searchParams.get('url');
	// Bypass cache if refresh=true — allows devs to force a fresh audit
	const refresh = searchParams.get('refresh') || false;

	// Get & Return Cached Result if exist
	// reading from cache
	const cached = await redis.get(`${CACHE_PREFIX}${url}`);

	// Return cached result if found
	if (cached && !refresh) {
		return Response.json(
			{
				data: cached,
				success: rateLimitCheck.success,
				limit: rateLimitCheck.limit,
				remaining: rateLimitCheck.remaining,
				reset: resetDate,
			},
			{ status: 200 },
		);
	}

	// if cached result is not found, run audit and save to cache
	try {
		await connectDB();
		const result = await parseMetaTags(url);

		// Set cached flag before persisting so both Redis and MongoDB reflect accurate state
		result.cached = true;

		//Cache result to redis
		await redis.set(`${CACHE_PREFIX}${url}`, result, {
			ex: CACHE_TTL,
		});

		const saved = await Audit.create(result);

		result.id = saved._id.toString()

		

		return Response.json(
			{
				data: result,
				success: rateLimitCheck.success,
				limit: rateLimitCheck.limit,
				remaining: rateLimitCheck.remaining,
				reset: resetDate,
			},
			{ status: 200 },
		);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Something went wrong';
		const status = !url ? 400 : 422;
		return Response.json({ error: message }, { status });
	}
}

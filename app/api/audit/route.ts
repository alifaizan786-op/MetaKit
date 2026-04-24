// app/api/audit/route.ts
import { parseMetaTags } from '@/lib/metaParser';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get('url');

	try {
		const result = await parseMetaTags(url);
		return Response.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Something went wrong';
		const status = !url ? 400 : 422;
		return Response.json({ error: message }, { status });
	}
}

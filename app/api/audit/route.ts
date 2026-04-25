// app/api/audit/route.ts
import { parseMetaTags } from '@/lib/metaParser';
import Audit from '@/models/Audit';
import connectDB from '@/lib/mongodb';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const url = searchParams.get('url');

	try {
		await connectDB();
		const result = await parseMetaTags(url);
		await Audit.create(result);

		return Response.json(result);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Something went wrong';
		const status = !url ? 400 : 422;
		return Response.json({ error: message }, { status });
	}
}

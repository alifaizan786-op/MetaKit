// app/api/history/route.ts
import connectDB from '@/lib/mongodb';
import Audit from '@/models/Audit';
import mongoose from 'mongoose';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');

	if (!id) {
		return Response.json(
			{ error: `_id is missing from request` },
			{ status: 400 },
		);
	}

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return Response.json(
			{ error: `_id is invalid` },
			{ status: 400 },
		);
	}

	try {
		await connectDB();
		const data = await Audit.findById(id);

		return Response.json(data, { status: 200 });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Something went wrong';

		return Response.json({ error: message }, { status: 422 });
	}
}
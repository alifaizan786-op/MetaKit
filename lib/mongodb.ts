// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Point cached directly at global.mongoose so any updates to cached.conn
// automatically update global.mongoose.conn too
global.mongoose = global.mongoose || { conn: null, promise: null };
let cached = global.mongoose;


async function connectDB() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectDB;

// models/audit.ts

import { Schema, model } from 'mongoose';

// Page Status Schema
const PageStatus = new Schema({
	status: {
		type: Number,
		required: true,
	},
	statusText: {
		type: String,
		required: true,
	},
});

// Open Graph Schema
const OG = new Schema({
	title: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	image: {
		type: String,
		required: false,
	},
});

// Twitter Schema
const Twitter = new Schema({
	title: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	image: {
		type: String,
		required: false,
	},
});

// Meta Schema
const Meta = new Schema({
	title: {
		type: String,
		required: false,
	},
	description: {
		type: String,
		required: false,
	},
	canonical: {
		type: String,
		required: false,
	},
	favicon: {
		type: String,
		required: false,
	},
	og: OG,
	twitter: Twitter,
});

// Warning Schema
const Warning = new Schema({
	message: {
		type: String,
		required: true,
	},
	severity: {
		type: String,
		enum: ['info', 'warning', 'error'],
		required: true,
		default: 'info',
	},
});

const auditSchema = new Schema({
	url: {
		type: String,
		required: true,
		trim: true,
	},
	pageStatus: PageStatus,
	auditedAt: {
		type: Date,
		default: Date.now,
	},
	cached: {
		type: Boolean,
		required: true,
	},
	warnings: [Warning],
	meta: Meta,
});

const Audit = model('Audit', auditSchema);

export default Audit;

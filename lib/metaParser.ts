// lib/metaParser.ts
import { AuditResult, Warning } from '@/types/audit';
import * as cheerio from 'cheerio';

export async function parseMetaTags(url: string | null): Promise<AuditResult> {
	if (!url) throw new Error('URL is required');

	const fetchUrl = await fetch(url);
	const html = await fetchUrl.text();
	const $ = cheerio.load(html);
	const favicon =
		$('link[rel="icon"]').attr('href') ||
		$('link[rel="shortcut icon"]').attr('href') ||
		$('link[rel="apple-touch-icon"]').attr('href') ||
		'/favicon.ico'; // default fallback — almost every site has this

	const auditResult = {
		id: '',
		url: url,
		pageStatus: {
			status: fetchUrl.status,
			statusText: fetchUrl.statusText,
		},
		auditedAt:  new Date().toISOString(),
		cached: false,
		warnings: [],  
		meta: {
			title: $('head > title').text(),
			description: $('meta[name="description"]').attr('content'),
			canonical: $('link[rel="canonical"]').attr('href'),
			favicon: favicon,
			og: {
				title: $('meta[property="og:title"], meta[name="og:title"]').attr(
					'content',
				),
				description: $(
					'meta[property="og:description"], meta[name="og:description"]',
				).attr('content'),
				image: $('meta[property="og:image"], meta[name="og:image"]').attr(
					'content',
				),
			},
			twitter: {
				title: $(
					'meta[property="twitter:title"], meta[name="twitter:title"]',
				).attr('content'),
				description: $(
					'meta[property="twitter:description"], meta[name="twitter:description"]',
				).attr('content'),
				image: $(
					'meta[property="twitter:image"], meta[name="twitter:image"]',
				).attr('content'),
			},
		},
	};

	const warnings = generateWarnings(auditResult);

	return { ...auditResult, warnings };
}

function generateWarnings(metaObj: AuditResult): Warning[] {
	const validUrl = /^https?:\/\/.+\..+/;
	const parameters = [
		{
			check: () => {
				if (!metaObj.meta.title)
					return [{ message: 'Title is missing', severity: 'error' as const }];
				if (metaObj.meta.title.length < 10)
					return [{ message: 'Title too short', severity: 'error' as const }];
				if (metaObj.meta.title.length > 60)
					return [{ message: 'Title too long', severity: 'error' as const }];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.description)
					return [
						{ message: 'Description is missing', severity: 'error' as const },
					];
				if (metaObj.meta.description.length < 50)
					return [
						{ message: 'Description too short', severity: 'warning' as const },
					];
				if (metaObj.meta.description.length > 160)
					return [
						{ message: 'Description too long', severity: 'warning' as const },
					];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.canonical)
					return [
						{ message: 'Canonical is missing', severity: 'info' as const },
					];
				if (!validUrl.test(metaObj.meta.canonical))
					return [
						{ message: 'Canonical URL is invalid', severity: 'info' as const },
					];
				return [];
			},
		},
		// TODO: Phase 2 — replace regex check with actual HEAD request to validate image URL returns 200
		// TODO: Phase 3 — Check Image dimensions
		{
			check: () => {
				if (!metaObj.meta.favicon)
					return [
						{ message: 'Favicon is missing', severity: 'warning' as const },
					];
				if (!validUrl.test(metaObj.meta.favicon))
					return [
						{ message: 'Favicon URL is invalid', severity: 'warning' as const },
					];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.og.title)
					return [
						{
							message: 'Open Graph (OG) Title is missing',
							severity: 'error' as const,
						},
					];
				if (metaObj.meta.og.title.length > 70)
					return [
						{
							message: 'Open Graph (OG) Title too long',
							severity: 'warning' as const,
						},
					];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.og.description)
					return [
						{
							message: 'Open Graph (OG) Description is missing',
							severity: 'error' as const,
						},
					];
				if (metaObj.meta.og.description.length > 200)
					return [
						{
							message: 'Open Graph (OG) Description too long',
							severity: 'warning' as const,
						},
					];
				return [];
			},
		},
		// TODO: Phase 2 — replace regex check with actual HEAD request to validate image URL returns 200
		// TODO: Phase 3 — Check Image dimensions
		{
			check: () => {
				if (!metaObj.meta.og.image)
					return [
						{
							message: 'Open Graph (OG) Image is missing',
							severity: 'error' as const,
						},
					];
				if (!validUrl.test(metaObj.meta.og.image))
					return [
						{
							message: 'Open Graph (OG) Image URL is invalid',
							severity: 'error' as const,
						},
					];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.twitter.title)
					return [
						{ message: 'Twitter Title is missing', severity: 'error' as const },
					];
				if (metaObj.meta.twitter.title.length > 70)
					return [
						{ message: 'Twitter Title too long', severity: 'warning' as const },
					];
				return [];
			},
		},
		{
			check: () => {
				if (!metaObj.meta.twitter.description)
					return [
						{
							message: 'Twitter Description is missing',
							severity: 'error' as const,
						},
					];
				if (metaObj.meta.twitter.description.length > 200)
					return [
						{
							message: 'Twitter Description too long',
							severity: 'warning' as const,
						},
					];
				return [];
			},
		},
		// TODO: Phase 2 — replace regex check with actual HEAD request to validate image URL returns 200
		// TODO: Phase 3 — Check Image dimensions
		{
			check: () => {
				if (!metaObj.meta.twitter.image)
					return [
						{ message: 'Twitter Image is missing', severity: 'error' as const },
					];
				if (!validUrl.test(metaObj.meta.twitter.image))
					return [
						{
							message: 'Twitter Image URL is invalid',
							severity: 'error' as const,
						},
					];
				return [];
			},
		},
	];
	let warnings = [];

	for (let i = 0; i < parameters.length; i++) {
		const element = parameters[i];
		const elementWarnings = element.check();
		if (elementWarnings) {
			warnings.push(...elementWarnings);
		}
	}
	return warnings;
}

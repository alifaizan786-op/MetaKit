'use client';
// app/history/[id]/page.tsx
// Shows the full audit detail for a specific past audit.
// Fetches from /api/history?id=[id] — returns the exact MongoDB document.
// Reuses the same preview and warning components as the main page.

import Error from '@/components/Error';
import MetaTags from '@/components/MetaTags';
import PreviewsWrapper from '@/components/PreviewsWrapper';
import Status from '@/components/status';
import WarningsList from '@/components/WarningsList';

import {
	Box,
	CircularProgress,
	Container,
	Grid,

	Typography
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Shape of the audit document returned from /api/history
interface AuditDetail {
	_id: string;
	url: string;
	pageStatus: { status: number; statusText: string };
	auditedAt: string;
	cached: boolean;
	warnings: Array<{ message: string; severity: 'error' | 'warning' | 'info' }>;
	meta: {
		title?: string;
		description?: string;
		canonical?: string;
		favicon?: string;
		og: { title?: string; description?: string; image?: string };
		twitter: { title?: string; description?: string; image?: string };
	};
}

export default function AuditDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const [audit, setAudit] = useState<AuditDetail | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Fetch the audit document from MongoDB via /api/history
	useEffect(() => {
		const fetchAudit = async () => {
			try {
				const res = await fetch(`/api/history?id=${id}`);
				const json = await res.json();

				if (!res.ok || json.error) {
					setError(json.error || 'Audit not found');
				} else {
					setAudit(json);
				}
			} catch {
				setError('Failed to load audit');
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchAudit();
	}, [id]);

	const meta = audit?.meta;

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			{/* ── Loading state ── */}
			{loading && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flex: 1,
						py: 10,
					}}>
					<CircularProgress color='primary' />
				</Box>
			)}

			{/* ── Error state ── */}
			{error && <Error message={error} />}

			{/* ── Audit detail ── */}
			{audit && meta && (
				<Container maxWidth='xl' sx={{ py: 4, flex: 1 }}>
					{/* Header — URL + status chips */}
					<Box sx={{ mb: 3 }}>
						<Typography
							variant='h5'
							sx={{
								fontFamily: '"JetBrains Mono", monospace',
								fontWeight: 600,
								wordBreak: 'break-all',
								mb: 1.5,
							}}>
							{audit.url}
						</Typography>
						<Status
							statusObj={{
								pageStatus: audit.pageStatus,
								cached: audit.cached,
								auditedAt: audit.auditedAt,
							}}
						/>
					</Box>

					<Grid container spacing={3}>
						{/* ── Warnings — full width ── */}
						<Grid size={{ xs: 12 }}>
							<WarningsList warnings={audit.warnings} />
						</Grid>

						{/* ── Left: Meta Tags ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<MetaTags metaTagObj={meta} />
						</Grid>

						{/* ── Right: Platform Previews ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<PreviewsWrapper metaTagObj={meta} url={audit.url} />
						
						</Grid>
					</Grid>
				</Container>
			)}

		
		</Box>
	);
}

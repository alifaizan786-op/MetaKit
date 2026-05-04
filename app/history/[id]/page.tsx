'use client';
// app/history/[id]/page.tsx
// Shows the full audit detail for a specific past audit.
// Fetches from /api/history?id=[id] — returns the exact MongoDB document.
// Reuses the same preview and warning components as the main page.

import Error from '@/components/Error';
import FacebookPreview from '@/components/previews/FacebookPreview';
import LinkedInPreview from '@/components/previews/LinkedInPreview';
import SlackPreview from '@/components/previews/SlackPreview';
import TwitterPreview from '@/components/previews/TwitterPreview';
import Status from '@/components/status';
import WarningsList from '@/components/WarningsList';

import {
	Box,
	CircularProgress,
	Container,
	Divider,
	Grid,
	Link,
	Paper,
	Typography,
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
							<Paper sx={{ p: 2.5 }} variant='outlined'>
								<Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
									Issues
								</Typography>
								<WarningsList warnings={audit.warnings} />
							</Paper>
						</Grid>

						{/* ── Left: Meta Tags ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Paper sx={{ p: 2.5 }} variant='outlined'>
								<Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
									Meta Tags
								</Typography>

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
									{[
										{ label: 'Title', value: meta.title },
										{ label: 'Description', value: meta.description },
										{ label: 'Canonical', value: meta.canonical },
										{ label: 'Favicon', value: meta.favicon },
									].map(({ label, value }) => (
										<Box key={label}>
											<Divider sx={{ mb: 1.5 }} />
											<Typography
												variant='caption'
												color='text.secondary'
												sx={{
													textTransform: 'uppercase',
													letterSpacing: '0.06em',
												}}>
												{label}
											</Typography>
											<Typography
												variant='body2'
												sx={{
													fontFamily: '"JetBrains Mono", monospace',
													fontSize: '0.78rem',
													wordBreak: 'break-all',
													mt: 0.25,
													color: value ? 'text.primary' : 'text.disabled',
												}}>
												{value || '—'}
											</Typography>
										</Box>
									))}

									{/* OG tags */}
									<Box>
										<Divider sx={{ mb: 1.5 }} />
										<Typography
											variant='caption'
											color='primary.main'
											sx={{
												textTransform: 'uppercase',
												letterSpacing: '0.06em',
												fontWeight: 600,
											}}>
											Open Graph
										</Typography>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												gap: 1,
												mt: 0.5,
											}}>
											{[
												{ label: 'og:title', value: meta.og.title },
												{ label: 'og:description', value: meta.og.description },
												{ label: 'og:image', value: meta.og.image },
											].map(({ label, value }) => (
												<Box key={label}>
													<Typography variant='caption' color='text.secondary'>
														{label}
													</Typography>
													<Typography
														variant='body2'
														sx={{
															fontFamily: '"JetBrains Mono", monospace',
															fontSize: '0.75rem',
															wordBreak: 'break-all',
															color: value ? 'text.primary' : 'text.disabled',
														}}>
														{value || '—'}
													</Typography>
												</Box>
											))}
										</Box>
									</Box>

									{/* Twitter tags */}
									<Box>
										<Divider sx={{ mb: 1.5 }} />
										<Typography
											variant='caption'
											color='primary.main'
											sx={{
												textTransform: 'uppercase',
												letterSpacing: '0.06em',
												fontWeight: 600,
											}}>
											Twitter / X
										</Typography>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												gap: 1,
												mt: 0.5,
											}}>
											{[
												{ label: 'twitter:title', value: meta.twitter.title },
												{
													label: 'twitter:description',
													value: meta.twitter.description,
												},
												{ label: 'twitter:image', value: meta.twitter.image },
											].map(({ label, value }) => (
												<Box key={label}>
													<Typography variant='caption' color='text.secondary'>
														{label}
													</Typography>
													<Typography
														variant='body2'
														sx={{
															fontFamily: '"JetBrains Mono", monospace',
															fontSize: '0.75rem',
															wordBreak: 'break-all',
															color: value ? 'text.primary' : 'text.disabled',
														}}>
														{value || '—'}
													</Typography>
												</Box>
											))}
										</Box>
									</Box>
								</Box>
							</Paper>
						</Grid>

						{/* ── Right: Platform Previews ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Paper sx={{ p: 2.5 }} variant='outlined'>
								<Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
									Platform Previews
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mb: 3 }}>
									How this URL appears when shared on each platform.
								</Typography>

								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
									<FacebookPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={audit.url}
									/>
									<TwitterPreview
										title={meta.twitter.title || meta.og.title || meta.title}
										description={
											meta.twitter.description ||
											meta.og.description ||
											meta.description
										}
										image={meta.twitter.image || meta.og.image}
										url={audit.url}
									/>
									<LinkedInPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={audit.url}
									/>
									<SlackPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={audit.url}
									/>
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			)}

			{/* ── Footer ── */}
			<Box
				component='footer'
				sx={{
					mt: 'auto',
					py: 3,
					borderTop: '1px solid',
					borderColor: 'divider',
					textAlign: 'center',
				}}>
				<Typography variant='caption' color='text.secondary'>
					MetaKit — Built by{' '}
					<Link
						href='https://linkedin.com/in/alifaizan786'
						target='_blank'
						color='primary.main'>
						Faizan Ali
					</Link>
				</Typography>
			</Box>
		</Box>
	);
}

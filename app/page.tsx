'use client';
// app/page.tsx
// The main MetaKit auditor page.
// User pastes a URL → hits Audit → sees meta tag results + social card previews side by side.
// State machine: idle → loading → results | error

import Error from '@/components/Error';
import MetaTags from '@/components/MetaTags';
import FacebookPreview from '@/components/previews/FacebookPreview';
import LinkedInPreview from '@/components/previews/LinkedInPreview';
import SlackPreview from '@/components/previews/SlackPreview';
import TwitterPreview from '@/components/previews/TwitterPreview';
import Status from '@/components/status';
import WarningsList from '@/components/WarningsList';
import { saveAudit } from '@/lib/indexedDB';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Grid,
	Link,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useState } from 'react';

// Shape of the API response
interface AuditResponse {
	data: {
		id: string;
		url: string;
		pageStatus: { status: number; statusText: string };
		auditedAt: string;
		cached: boolean;
		warnings: Array<{
			message: string;
			severity: 'error' | 'warning' | 'info';
		}>;
		meta: {
			title?: string;
			description?: string;
			canonical?: string;
			favicon?: string;
			og: { title?: string; description?: string; image?: string };
			twitter: { title?: string; description?: string; image?: string };
		};
	};
	remaining: number;
	limit: number;
	reset: string;
	error?: string;
}

export default function Home() {
	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<AuditResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	// Run the audit — calls our own API route
	const runAudit = async (forceRefresh = false) => {
		if (!url.trim()) return;

		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const params = new URLSearchParams({ url: url.trim() });
			if (forceRefresh) params.set('refresh', 'true');

			const res = await fetch(`/api/audit?${params.toString()}`);
			const json: AuditResponse = await res.json();

			if (!res.ok || json.error) {
				setError(json.error || 'Something went wrong');
			} else {
				setResult(json);
				// save to IndexedDB so it shows up in history
				await saveAudit({
					url: url.trim(),
					id: json.data.id,
					auditedAt: json.data.auditedAt,
				});
			}
		} catch (e) {
			setError('Network error — could not reach the audit API');
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	// Copy the shareable API link to clipboard
	const copyApiLink = () => {
		const apiUrl = `${window.location.origin}/api/audit?url=${encodeURIComponent(url)}`;
		navigator.clipboard.writeText(apiUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const meta = result?.data?.meta;

	return (
		<Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			{/* ── Hero / input section ── */}
			<Box
				sx={{
					py: { xs: 6, md: 10 },
					px: 2,
					textAlign: 'center',
					backgroundImage: (theme) =>
						theme.palette.mode === 'dark'
							? 'radial-gradient(ellipse at 50% 0%, rgba(0,229,160,0.06) 0%, transparent 70%)'
							: 'radial-gradient(ellipse at 50% 0%, rgba(0,163,114,0.07) 0%, transparent 70%)',
				}}>
				<Container maxWidth='md'>
					<Chip
						label='Free Developer Tool'
						size='small'
						color='primary'
						variant='outlined'
						sx={{
							mb: 2,
							fontFamily: '"JetBrains Mono", monospace',
							fontSize: '0.7rem',
						}}
					/>

					<Typography
						variant='h1'
						sx={{ fontSize: { xs: '2rem', md: '3rem' }, mb: 1.5 }}>
						Audit your meta tags{' '}
						<Box component='span' sx={{ color: 'primary.main' }}>
							instantly
						</Box>
					</Typography>

					<Typography
						color='text.secondary'
						sx={{ mb: 4, maxWidth: 540, mx: 'auto', fontSize: '1.05rem' }}>
						Paste any URL and see exactly how it renders on Facebook, Twitter,
						LinkedIn, and Slack. Plus a full meta tag report with actionable
						warnings.
					</Typography>

					{/* ── URL Input row ── */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							gap: 1.5,
							alignItems: 'stretch',
						}}>
						<TextField
							fullWidth
							placeholder='https://yoursite.com'
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && runAudit()}
							slotProps={{
								input: {
									startAdornment: (
										<LinkRoundedIcon
											sx={{ mr: 1, color: 'text.secondary' }}
											fontSize='small'
										/>
									),
									sx: {
										fontFamily: '"JetBrains Mono", monospace',
										fontSize: '0.9rem',
									},
								},
							}}
							sx={{ flex: 1 }}
						/>
						<Button
							variant='contained'
							size='large'
							onClick={() => runAudit()}
							disabled={loading || !url.trim()}
							startIcon={
								loading ? (
									<CircularProgress size={16} color='inherit' />
								) : (
									<SearchRoundedIcon />
								)
							}
							sx={{ px: 4, whiteSpace: 'nowrap', minWidth: 140 }}>
							{loading ? 'Auditing...' : 'Audit'}
						</Button>
					</Box>

					{/* Example URL shortcuts */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							gap: 1,
							justifyContent: 'center',
							mt: 2,
							flexWrap: 'wrap',
							alignItems: 'center',
						}}>
						<Typography variant='body2' color='text.secondary'>
							Try:
						</Typography>
						{[
							'https://github.com',
							'https://vercel.com',
							'https://stripe.com',
						].map((example) => (
							<Typography
								key={example}
								variant='body2'
								color='primary.main'
								sx={{
									cursor: 'pointer',
									'&:hover': { textDecoration: 'underline' },
								}}
								onClick={() => setUrl(example)}>
								{example.replace('https://', '')}
							</Typography>
						))}
					</Box>
				</Container>
			</Box>

			{/* ── Error state ── */}
			{error && <Error message={error} />}

			{/* ── Results section ── */}
			{result && meta && (
				<Container maxWidth='xl' sx={{ py: 4, flex: 1 }}>
					{/* Result header bar */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'column', sm: 'row' },
							justifyContent: 'space-between',
							alignItems: { xs: 'flex-start', sm: 'center' },
							mb: 3,
							gap: 1,
						}}>
						{/* Left: status chips + timestamp */}
						<Status
							statusObj={{
								pageStatus: result.data.pageStatus,
								cached: result.data.cached,
								auditedAt: result.data.auditedAt,
							}}
						/>

						{/* Right: action buttons */}
						<Box sx={{ display: 'flex', gap: 1 }}>
							<Button
								size='small'
								variant='outlined'
								startIcon={<RefreshRoundedIcon />}
								onClick={() => runAudit(true)}>
								Refresh
							</Button>
							<Tooltip title={copied ? 'Copied!' : 'Copy API link'}>
								<Button
									size='small'
									variant='outlined'
									startIcon={<ContentCopyRoundedIcon />}
									onClick={copyApiLink}
									color={copied ? 'success' : 'inherit'}>
									{copied ? 'Copied' : 'Share'}
								</Button>
							</Tooltip>
						</Box>
					</Box>

					<Grid container spacing={3}>
						{/* ── Warnings — full width ── */}
						<Grid size={{ xs: 12 }}>
							<WarningsList warnings={result.data.warnings} />
						</Grid>

						{/* ── Left: Meta Tags — 50% ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<MetaTags metaTagObj={meta} />
						</Grid>

						{/* ── Right: Platform Previews — 50% ── */}
						<Grid size={{ xs: 12, md: 6 }}>
							<Paper sx={{ p: 2.5 }} variant='outlined'>
								<Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
									Platform Previews
								</Typography>
								<Typography
									variant='body2'
									color='text.secondary'
									sx={{ mb: 3 }}>
									How this URL will appear when shared on each platform.
								</Typography>

								{/* Previews stacked vertically — full width in their column */}
								<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
									<FacebookPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={result.data.url}
									/>
									<TwitterPreview
										title={meta.twitter.title || meta.og.title || meta.title}
										description={
											meta.twitter.description ||
											meta.og.description ||
											meta.description
										}
										image={meta.twitter.image || meta.og.image}
										url={result.data.url}
									/>
									<LinkedInPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={result.data.url}
									/>
									<SlackPreview
										title={meta.og.title || meta.title}
										description={meta.og.description || meta.description}
										image={meta.og.image}
										url={result.data.url}
									/>
								</Box>
							</Paper>

							{/* Rate limit info */}
							<Typography
								variant='caption'
								color='text.secondary'
								sx={{ mt: 2, display: 'block' }}>
								{result.remaining} of {result.limit} daily audits remaining
							</Typography>
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
					{' · '}
					<Link href='/docs' color='text.secondary'>
						API Docs
					</Link>
					{' · '}
					<Link
						href='https://github.com/alifaizan786-op/MetaKit'
						target='_blank'
						color='text.secondary'>
						GitHub
					</Link>
				</Typography>
			</Box>
		</Box>
	);
}

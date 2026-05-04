'use client';
// app/docs/page.tsx
// MetaKit API documentation page.
// Shows the endpoint, parameters, example request, and live example response.
// The "Try it" section calls the real API — the docs eat their own dog food.

import ThemeToggle from '@/components/ThemeToggle';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
	AppBar,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Divider,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Toolbar,
	Typography
} from '@mui/material';
import { useState } from 'react';

// Inline code block styled component using MUI Box
const Code = ({ children }: { children: React.ReactNode }) => (
	<Box
		component='code'
		sx={{
			fontFamily: '"JetBrains Mono", monospace',
			fontSize: '0.82rem',
			backgroundColor: 'action.hover',
			px: 0.75,
			py: 0.25,
			borderRadius: 0.5,
		}}>
		{children}
	</Box>
);

// Full code block with dark background
const CodeBlock = ({ children }: { children: string }) => (
	<Box
		sx={{
			fontFamily: '"JetBrains Mono", monospace',
			fontSize: '0.82rem',
			backgroundColor: (theme) =>
				theme.palette.mode === 'dark' ? '#0d1117' : '#f6f8fa',
			border: '1px solid',
			borderColor: 'divider',
			borderRadius: 1,
			p: 2,
			overflowX: 'auto',
			whiteSpace: 'pre',
			color: 'text.primary',
		}}>
		{children}
	</Box>
);

export default function DocsPage() {
	const [tryUrl, setTryUrl] = useState('https://github.com');
	const [tryResult, setTryResult] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Live API call from the docs page — eats our own dog food
	const runExample = async () => {
		setLoading(true);
		setTryResult(null);
		try {
			const res = await fetch(`/api/audit?url=${encodeURIComponent(tryUrl)}`);
			const json = await res.json();
			setTryResult(JSON.stringify(json, null, 2));
		} catch {
			setTryResult('Error: Could not reach the API');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ minHeight: '100vh' }}>
			

			<Container maxWidth='md' sx={{ py: 6 }}>
				{/* Header */}
				<Chip
					label='v1'
					size='small'
					color='primary'
					variant='outlined'
					sx={{ mb: 2, fontFamily: '"JetBrains Mono", monospace' }}
				/>
				<Typography variant='h2' sx={{ mb: 1 }}>
					MetaKit API
				</Typography>
				<Typography color='text.secondary' sx={{ mb: 4 }}>
					A free public REST API for auditing website meta tags, Open Graph
					data, and Twitter Card data. No authentication required.
				</Typography>

				<Divider sx={{ mb: 4 }} />

				{/* Base URL */}
				<Typography variant='h4' sx={{ mb: 2 }}>
					Base URL
				</Typography>
				<CodeBlock>{'https://metakit-nu.vercel.app/'}</CodeBlock>

				<Divider sx={{ my: 4 }} />

				{/* Endpoint */}
				<Typography variant='h4' sx={{ mb: 2 }}>
					Endpoints
				</Typography>

				{/* GET /audit */}
				<Paper variant='outlined' sx={{ p: 3, mb: 3 }}>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
						<Chip
							label='GET'
							color='success'
							size='small'
							sx={{
								fontFamily: '"JetBrains Mono", monospace',
								fontWeight: 700,
							}}
						/>
						<Typography
							sx={{
								fontFamily: '"JetBrains Mono", monospace',
								fontSize: '1rem',
							}}>
							/audit
						</Typography>
					</Box>

					<Typography color='text.secondary' sx={{ mb: 3 }}>
						Fetch and parse all meta tags for a given URL. Results are cached
						for 24 hours. Use <Code>refresh=true</Code> to bypass the cache.
					</Typography>

					{/* Parameters table */}
					<Typography variant='h6' sx={{ mb: 1.5 }}>
						Parameters
					</Typography>
					<Table size='small' sx={{ mb: 3 }}>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: 700 }}>Parameter</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Required</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>
									<Code>url</Code>
								</TableCell>
								<TableCell>
									<Code>string</Code>
								</TableCell>
								<TableCell>Yes</TableCell>
								<TableCell>
									The full URL to audit (must include https://)
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>
									<Code>refresh</Code>
								</TableCell>
								<TableCell>
									<Code>boolean</Code>
								</TableCell>
								<TableCell>No</TableCell>
								<TableCell>
									Set to <Code>true</Code> to bypass the 24-hour cache
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>

					{/* Example request */}
					<Typography variant='h6' sx={{ mb: 1.5 }}>
						Example Request
					</Typography>
					<CodeBlock>{`curl "https://metakit.dev/api/audit?url=https://github.com"`}</CodeBlock>

					{/* Example response */}
					<Typography variant='h6' sx={{ mt: 3, mb: 1.5 }}>
						Example Response
					</Typography>
					<CodeBlock>{`{
  "data": {
    "url": "https://github.com",
    "pageStatus": { "status": 200, "statusText": "OK" },
    "auditedAt": "2026-04-24T05:54:13.518Z",
    "cached": false,
    "warnings": [
      { "message": "Title too long", "severity": "error" }
    ],
    "meta": {
      "title": "GitHub · Build and ship software",
      "description": "GitHub is where ...",
      "canonical": "https://github.com",
      "favicon": "https://github.githubassets.com/favicons/favicon.svg",
      "og": {
        "title": "GitHub · Build and ship software",
        "description": "GitHub is where ...",
        "image": "https://..."
      },
      "twitter": {
        "title": "GitHub · Build and ship software",
        "description": "GitHub is where ...",
        "image": "https://..."
      }
    }
  },
  "remaining": 19,
  "limit": 20,
  "reset": "2026-04-25T05:54:13.518Z"
}`}</CodeBlock>
				</Paper>

				{/* Rate limiting section */}
				<Typography variant='h4' sx={{ mb: 2 }}>
					Rate Limiting
				</Typography>
				<Typography color='text.secondary' sx={{ mb: 2 }}>
					The API is rate limited to <strong>20 requests per IP per day</strong>
					. The response includes headers so you can track your usage.
				</Typography>
				<Table size='small' sx={{ mb: 4 }}>
					<TableHead>
						<TableRow>
							<TableCell sx={{ fontWeight: 700 }}>Field</TableCell>
							<TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{[
							{
								field: 'remaining',
								desc: 'Requests left in the current 24-hour window',
							},
							{ field: 'limit', desc: 'Total requests allowed per day (20)' },
							{
								field: 'reset',
								desc: 'ISO timestamp of when the window resets',
							},
						].map(({ field, desc }) => (
							<TableRow key={field}>
								<TableCell>
									<Code>{field}</Code>
								</TableCell>
								<TableCell>{desc}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

				<Divider sx={{ mb: 4 }} />

				{/* Live Try It section */}
				<Typography variant='h4' sx={{ mb: 1 }}>
					Try It
				</Typography>
				<Typography color='text.secondary' sx={{ mb: 3 }}>
					Run a live audit against the real API directly from this page.
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, mb: 2 }}>
					<TextField
						fullWidth
						value={tryUrl}
						onChange={(e) => setTryUrl(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && runExample()}
						placeholder='https://yoursite.com'
						slotProps={{ input: { sx: {
								fontFamily: '"JetBrains Mono", monospace',
								fontSize: '0.85rem',
						} } }}
					/>
					<Button
						variant='contained'
						onClick={runExample}
						disabled={loading}
						startIcon={
							loading ? (
								<CircularProgress size={16} color='inherit' />
							) : (
								<SearchRoundedIcon />
							)
						}
						sx={{ whiteSpace: 'nowrap', minWidth: 120 }}>
						{loading ? 'Running...' : 'Run'}
					</Button>
				</Box>

				{tryResult && (
					<Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
						<CodeBlock>{tryResult}</CodeBlock>
					</Box>
				)}
			</Container>
		</Box>
	);
}

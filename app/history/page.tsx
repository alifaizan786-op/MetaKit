'use client';
// app/history/page.tsx
// Audit history page — fetches recent audits from MongoDB and displays them in a table.
// This is a server component — it fetches data at request time, no useEffect needed.
// Server components can directly call the DB without going through the API route.

import { getAudits } from '@/lib/indexedDB';
import { useEffect, useState } from 'react';

import {
	Box,
	Chip,
	Container,
	Link,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from '@mui/material';

interface AuditHistoryResponse {
	_id: string;
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
}

// Severity color map for the warning count chip
function getWorstSeverity(warnings: Array<{ severity: string }>) {
	if (warnings.some((w) => w.severity === 'error')) return 'error';
	if (warnings.some((w) => w.severity === 'warning')) return 'warning';
	if (warnings.length > 0) return 'info';
	return 'success';
}

export default function HistoryPage() {
	const [audits, setAudits] = useState<AuditHistoryResponse[]>([]);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			const auditHistoryIndexedDb = await getAudits();
			const tempArr: AuditHistoryResponse[] = [];

			for (let i = 0; i < auditHistoryIndexedDb.length; i++) {
				const params = new URLSearchParams({ id: auditHistoryIndexedDb[i].id });
				const res = await fetch(`/api/history?${params.toString()}`);
				const json: AuditHistoryResponse = await res.json();
				tempArr.push(json);
			}

			if (!cancelled) setAudits(tempArr);
		};

		load().catch(console.error);

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<Box sx={{ minHeight: '100vh' }}>
		

			<Container maxWidth='xl' sx={{ py: 5 }}>
				<Typography variant='h3' sx={{ mb: 1 }}>
					Audit History
				</Typography>
				<Typography color='text.secondary' sx={{ mb: 4 }}>
					The last {audits.length} audits run through MetaKit.
				</Typography>

				{audits.length === 0 ? (
					<Paper variant='outlined' sx={{ p: 4, textAlign: 'center' }}>
						<Typography color='text.secondary'>
							No audits yet. Run your first audit on the home page.
						</Typography>
					</Paper>
				) : (
					<Paper variant='outlined' sx={{ overflow: 'hidden' }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell sx={{ fontWeight: 700 }}>URL</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Issues</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Cached</TableCell>
									<TableCell sx={{ fontWeight: 700 }}>Audited</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{audits.map((audit: AuditHistoryResponse) => (
									<TableRow key={audit._id} hover>
										{/* URL — truncated with monospace font */}
										<TableCell
											sx={{
												fontFamily: '"JetBrains Mono", monospace',
												fontSize: '0.78rem',
												maxWidth: 280,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
											}}>
											<Link
												href={`/history/${audit._id}`}
												color='primary.main'
												underline='hover'>
												{audit.url}
											</Link>
										</TableCell>

										{/* HTTP status */}
										<TableCell>
											<Chip
												label={audit.pageStatus?.status || '—'}
												size='small'
												color={
													audit.pageStatus?.status === 200 ? 'success' : 'error'
												}
											/>
										</TableCell>

										{/* Page title */}
										<TableCell
											sx={{
												maxWidth: 240,
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												whiteSpace: 'nowrap',
												fontSize: '0.85rem',
											}}>
											{audit.meta?.title || '—'}
										</TableCell>

										{/* Warning count chip — color = worst severity */}
										<TableCell>
											{audit.warnings?.length > 0 ? (
												<Chip
													label={`${audit.warnings.length} issue${audit.warnings.length > 1 ? 's' : ''}`}
													size='small'
													color={
														getWorstSeverity(audit.warnings) as
															| 'error'
															| 'warning'
															| 'info'
															| 'success'
													}
												/>
											) : (
												<Chip label='Clean' size='small' color='success' />
											)}
										</TableCell>

										{/* Cached flag */}
										<TableCell>
											<Chip
												label={audit.cached ? 'Cached' : 'Live'}
												size='small'
												variant='outlined'
												color={audit.cached ? 'info' : 'default'}
											/>
										</TableCell>

										{/* Timestamp */}
										<TableCell
											sx={{
												fontSize: '0.8rem',
												color: 'text.secondary',
												whiteSpace: 'nowrap',
											}}>
											{new Date(audit.auditedAt).toLocaleString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Paper>
				)}
			</Container>
		</Box>
	);
}

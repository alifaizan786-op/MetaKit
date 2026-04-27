// app/history/page.tsx
// Audit history page — fetches recent audits from MongoDB and displays them in a table.
// This is a server component — it fetches data at request time, no useEffect needed.
// Server components can directly call the DB without going through the API route.

import ThemeToggle from '@/components/ThemeToggle';
import connectDB from '@/lib/mongodb';
import Audit from '@/models/Audit';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
	AppBar,
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
	Toolbar,
	Typography,
} from '@mui/material';

// Fetch the 50 most recent audits directly from MongoDB
// Since this is a server component, we can use Mongoose directly — no fetch() needed
async function getRecentAudits() {
	await connectDB();
	const audits = await Audit.find({})
		.sort({ auditedAt: -1 }) // newest first
		.limit(50)
		.lean(); // .lean() returns plain JS objects, faster than full Mongoose docs
	return audits;
}

// Severity color map for the warning count chip
function getWorstSeverity(warnings: Array<{ severity: string }>) {
	if (warnings.some((w) => w.severity === 'error')) return 'error';
	if (warnings.some((w) => w.severity === 'warning')) return 'warning';
	if (warnings.length > 0) return 'info';
	return 'success';
}

export default async function HistoryPage() {
	const audits = await getRecentAudits();

	return (
		<Box sx={{ minHeight: '100vh' }}>
			{/* Nav */}
			<AppBar
				position='sticky'
				elevation={0}
				sx={{
					borderBottom: '1px solid',
					borderColor: 'divider',
					backgroundColor: 'background.paper',
				}}>
				<Toolbar>
					<Link
						href='/'
						color='text.secondary'
						sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
						<ArrowBackRoundedIcon fontSize='small' />
					</Link>
					<Typography
						variant='h6'
						sx={{
							fontFamily: '"Space Grotesk", sans-serif',
							fontWeight: 700,
							color: 'primary.main',
							flex: 1,
						}}>
						Meta
						<Box component='span' sx={{ color: 'text.primary' }}>
							Kit
						</Box>
						<Box
							component='span'
							sx={{
								color: 'text.secondary',
								fontWeight: 400,
								fontSize: '0.9rem',
								ml: 1,
							}}>
							/ History
						</Box>
					</Typography>
					<ThemeToggle />
				</Toolbar>
			</AppBar>

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
								{audits.map((audit: any) => (
									<TableRow key={audit._id.toString()} hover>
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
												href={`/?url=${encodeURIComponent(audit.url)}`}
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
													color={getWorstSeverity(audit.warnings) as any}
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

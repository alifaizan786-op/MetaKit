import { Meta } from '@/types/audit';

import { Box, Divider, Paper, Typography } from '@mui/material';

export default function MetaTags({ metaTagObj }: {metaTagObj:Meta}) {
	return (
		<Paper sx={{ p: 2.5 }} variant='outlined'>
			<Typography variant='h6' sx={{ fontWeight: 700, mb: 2 }}>
				Meta Tags
			</Typography>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{[
					{ label: 'Title', value: metaTagObj.title },
					{ label: 'Description', value: metaTagObj.description },
					{ label: 'Canonical', value: metaTagObj.canonical },
					{ label: 'Favicon', value: metaTagObj.favicon },
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
							{ label: 'og:title', value: metaTagObj.og.title },
							{ label: 'og:description', value: metaTagObj.og.description },
							{ label: 'og:image', value: metaTagObj.og.image },
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
							{ label: 'twitter:title', value: metaTagObj.twitter.title },
							{
								label: 'twitter:description',
								value: metaTagObj.twitter.description,
							},
							{ label: 'twitter:image', value: metaTagObj.twitter.image },
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
	);
}

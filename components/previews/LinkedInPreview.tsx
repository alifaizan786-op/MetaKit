'use client';
// components/previews/LinkedInPreview.tsx
// LinkedIn uses og:title, og:description, and og:image — same as Facebook.
// Key difference: LinkedIn shows the image on the LEFT in a smaller thumbnail format,
// not as a full-width banner. Title is heavier weight.

import { Box, Typography, useTheme } from '@mui/material';

interface LinkedInPreviewProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

export default function LinkedInPreview({
	title,
	description,
	image,
	url,
}: LinkedInPreviewProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	const domain = url
		? new URL(url).hostname.replace('www.', '')
		: 'example.com';

	return (
		<Box>
			<Typography
				variant='caption'
				sx={{
					fontFamily: '"JetBrains Mono", monospace',
					color: 'text.secondary',
					mb: 1,
					display: 'block',
					textTransform: 'uppercase',
					letterSpacing: '0.08em',
				}}>
				LinkedIn
			</Typography>

			{/* LinkedIn card — image on left, text on right (horizontal layout) */}
			<Box
				sx={{
					width: '100%',
					maxWidth: 500,
					border: `1px solid ${isDark ? '#38434f' : '#e0e0e0'}`,
					borderRadius: '2px', // LinkedIn uses very slight rounding
					overflow: 'hidden',
					backgroundColor: isDark ? '#1b2a38' : '#ffffff',
					display: 'flex',
					flexDirection: 'row',
					fontFamily: '"LinkedIn Sans", "Helvetica Neue", Arial, sans-serif',
				}}>
				{/* Thumbnail image — small square on the left */}
				{image ? (
					<Box
						component='img'
						src={image}
						alt={title || 'Preview image'}
						sx={{
							width: 120,
							minWidth: 120,
							height: 'auto',
							objectFit: 'cover',
							display: 'block',
							borderRight: `1px solid ${isDark ? '#38434f' : '#e0e0e0'}`,
						}}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				) : (
					<Box
						sx={{
							width: 120,
							minWidth: 120,
							backgroundColor: isDark ? '#38434f' : '#e0e0e0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							p: 1,
						}}>
						<Typography
							variant='caption'
							color='text.secondary'
							sx={{ textAlign: 'center' }}>
							No image
						</Typography>
					</Box>
				)}

				{/* Text content — right side */}
				<Box sx={{ px: 1.5, py: 1.25, flex: 1, minWidth: 0 }}>
					<Typography
						sx={{
							fontSize: '0.85rem',
							fontWeight: 600,
							color: isDark ? '#e8e8e8' : '#000000',
							lineHeight: 1.3,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
							mb: 0.5,
						}}>
						{title || 'No title found'}
					</Typography>

					<Typography
						sx={{
							fontSize: '0.75rem',
							color: isDark ? '#aaaaaa' : '#666666',
							lineHeight: 1.4,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
							mb: 0.5,
						}}>
						{description || 'No description found'}
					</Typography>

					<Typography
						sx={{
							fontSize: '0.7rem',
							color: isDark ? '#aaaaaa' : '#666666',
							fontFamily: 'inherit',
						}}>
						{domain}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

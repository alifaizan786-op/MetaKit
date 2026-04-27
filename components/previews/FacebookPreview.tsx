'use client';
// components/previews/FacebookPreview.tsx
// Renders a pixel-accurate mockup of how a URL looks when shared on Facebook.
// Facebook uses og:title, og:description, and og:image.
// Card dimensions follow Facebook's actual link preview spec (~526px wide).

import { Box, Typography, useTheme } from '@mui/material';

interface FacebookPreviewProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

export default function FacebookPreview({
	title,
	description,
	image,
	url,
}: FacebookPreviewProps) {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	// Extract just the domain from the URL for the "source" label Facebook shows
	const domain = url
		? new URL(url).hostname.replace('www.', '')
		: 'example.com';

	return (
		<Box>
			{/* Platform label */}
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
				Facebook
			</Typography>

			{/* Card shell — mimics Facebook's link preview container */}
			<Box
				sx={{
					width: '100%',
					maxWidth: 500,
					border: `1px solid ${isDark ? '#3a3b3c' : '#ddd'}`,
					borderRadius: '0px', // Facebook uses sharp corners
					overflow: 'hidden',
					backgroundColor: isDark ? '#242526' : '#f0f2f5',
					fontFamily: '"Helvetica Neue", Arial, sans-serif',
				}}>
				{/* OG Image */}
				{image ? (
					<Box
						component='img'
						src={image}
						alt={title || 'Preview image'}
						sx={{
							width: '100%',
							aspectRatio: '1.91/1', // Facebook's standard OG image ratio
							objectFit: 'cover',
							display: 'block',
						}}
						onError={(e) => {
							// If image fails to load, show a placeholder
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				) : (
					// Placeholder when no OG image is set
					<Box
						sx={{
							width: '100%',
							aspectRatio: '1.91/1',
							backgroundColor: isDark ? '#3a3b3c' : '#ccc',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Typography variant='caption' color='text.secondary'>
							No OG image
						</Typography>
					</Box>
				)}

				{/* Text content area */}
				<Box
					sx={{
						px: 1.5,
						py: 1.25,
						borderTop: `1px solid ${isDark ? '#3a3b3c' : '#ddd'}`,
					}}>
					{/* Domain — Facebook shows this in uppercase above the title */}
					<Typography
						sx={{
							fontSize: '0.68rem',
							color: isDark ? '#b0b3b8' : '#65676b',
							textTransform: 'uppercase',
							mb: 0.25,
							fontFamily: 'inherit',
						}}>
						{domain}
					</Typography>

					{/* Title — Facebook truncates at ~2 lines */}
					<Typography
						sx={{
							fontSize: '0.9rem',
							fontWeight: 600,
							color: isDark ? '#e4e6eb' : '#1c1e21',
							lineHeight: 1.3,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
							mb: 0.25,
						}}>
						{title || 'No title found'}
					</Typography>

					{/* Description — truncated at ~3 lines */}
					<Typography
						sx={{
							fontSize: '0.8rem',
							color: isDark ? '#b0b3b8' : '#65676b',
							lineHeight: 1.4,
							display: '-webkit-box',
							WebkitLineClamp: 3,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
						}}>
						{description || 'No description found'}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

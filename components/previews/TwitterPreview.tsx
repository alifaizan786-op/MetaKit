'use client';
// components/previews/TwitterPreview.tsx
// Renders a pixel-accurate mockup of how a URL looks when shared on Twitter/X.
// Twitter uses twitter:title, twitter:description, twitter:image, and twitter:card.
// "summary_large_image" card type shows a big image above the text.

import { Box, Typography, useTheme } from '@mui/material';

interface TwitterPreviewProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

export default function TwitterPreview({
	title,
	description,
	image,
	url,
}: TwitterPreviewProps) {
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
				Twitter / X
			</Typography>

			{/* Twitter card shell — rounded corners, tighter than Facebook */}
			<Box
				sx={{
					width: '100%',
					maxWidth: 500,
					border: `1px solid ${isDark ? '#2f3336' : '#cfd9de'}`,
					borderRadius: '16px', // Twitter uses noticeably rounded corners
					overflow: 'hidden',
					backgroundColor: isDark ? '#16181c' : '#ffffff',
					fontFamily: '"TwitterChirp", "Helvetica Neue", Arial, sans-serif',
				}}>
				{/* Large image — Twitter's summary_large_image format */}
				{image ? (
					<Box
						component='img'
						src={image}
						alt={title || 'Preview image'}
						sx={{
							width: '100%',
							aspectRatio: '2/1', // Twitter's large card ratio is wider than Facebook's
							objectFit: 'cover',
							display: 'block',
						}}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				) : (
					<Box
						sx={{
							width: '100%',
							aspectRatio: '2/1',
							backgroundColor: isDark ? '#2f3336' : '#eff3f4',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<Typography variant='caption' color='text.secondary'>
							No twitter:image
						</Typography>
					</Box>
				)}

				{/* Text content */}
				<Box
					sx={{
						px: 1.5,
						py: 1,
						borderTop: `1px solid ${isDark ? '#2f3336' : '#cfd9de'}`,
					}}>
					<Typography
						sx={{
							fontSize: '0.8rem',
							color: isDark ? '#71767b' : '#536471',
							mb: 0.25,
							fontFamily: 'inherit',
						}}>
						{domain}
					</Typography>

					<Typography
						sx={{
							fontSize: '0.9rem',
							fontWeight: 700,
							color: isDark ? '#e7e9ea' : '#0f1419',
							lineHeight: 1.3,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
						}}>
						{title || 'No title found'}
					</Typography>

					<Typography
						sx={{
							fontSize: '0.8rem',
							color: isDark ? '#71767b' : '#536471',
							lineHeight: 1.4,
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							overflow: 'hidden',
							fontFamily: 'inherit',
							mt: 0.25,
						}}>
						{description || 'No description found'}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

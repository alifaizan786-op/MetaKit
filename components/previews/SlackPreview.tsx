'use client';
// components/previews/SlackPreview.tsx
// Slack's link unfurl shows a left colored border, title, description, and small thumbnail.
// It reads og:title and og:description. The image appears as a small right-aligned thumbnail.
// Slack uses a distinctive left accent bar — that's the most recognizable UI element.

import { Box, Typography, useTheme } from '@mui/material';

interface SlackPreviewProps {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
	siteName?: string;
}

export default function SlackPreview({
	title,
	description,
	image,
	url,
	siteName,
}: SlackPreviewProps) {
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
				Slack
			</Typography>

			{/* Slack unfurl container */}
			<Box
				sx={{
					width: '100%',
					maxWidth: 500,
					display: 'flex',
					flexDirection: 'row',
					backgroundColor: isDark ? '#1a1d21' : '#ffffff',
					border: `1px solid ${isDark ? '#2d2f34' : '#e8e8e8'}`,
					borderRadius: '4px',
					overflow: 'hidden',
					fontFamily: '"Lato", "Helvetica Neue", Arial, sans-serif',
				}}>
				{/* The signature Slack left accent bar */}
				<Box
					sx={{
						width: 4,
						minWidth: 4,
						backgroundColor: '#E01E5A', // Slack's brand pink/red — always this color
					}}
				/>

				{/* Main content area */}
				<Box sx={{ px: 1.5, py: 1.25, flex: 1, minWidth: 0 }}>
					{/* Site name — Slack shows this above the title */}
					<Typography
						sx={{
							fontSize: '0.8rem',
							fontWeight: 700,
							color: isDark ? '#1d9bd1' : '#1264a3', // Slack's link blue
							mb: 0.25,
							fontFamily: 'inherit',
						}}>
						{siteName || domain}
					</Typography>

					{/* Title */}
					<Typography
						sx={{
							fontSize: '0.85rem',
							fontWeight: 700,
							color: isDark ? '#d1d2d3' : '#1d1c1d',
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

					{/* Description */}
					<Typography
						sx={{
							fontSize: '0.8rem',
							color: isDark ? '#9b9b9b' : '#616061',
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

				{/* Small thumbnail — Slack shows this right-aligned */}
				{image && (
					<Box
						component='img'
						src={image}
						alt={title || 'Preview'}
						sx={{
							width: 72,
							height: 72,
							minWidth: 72,
							objectFit: 'cover',
							alignSelf: 'center',
							mr: 1.5,
							borderRadius: '4px',
						}}
						onError={(e) => {
							(e.target as HTMLImageElement).style.display = 'none';
						}}
					/>
				)}
			</Box>
		</Box>
	);
}

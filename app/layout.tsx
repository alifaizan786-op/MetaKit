// app/layout.tsx
// Root layout — wraps every page with the ThemeRegistry (MUI + color mode)
// Also loads Google Fonts for Space Grotesk, DM Sans, and JetBrains Mono

import ThemeRegistry from '@/components/ThemeRegistry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'MetaKit — Website Meta & SEO Toolbox',
	description:
		'Audit Open Graph, Twitter Card, and standard meta tags for any URL. Free developer tool with a public REST API.',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head>
				{/* Google Fonts — preconnect first for performance */}
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin='anonymous'
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap'
					rel='stylesheet'
				/>
			</head>
			<body>
				{/* ThemeRegistry provides MUI ThemeProvider + system color mode detection */}
				<ThemeRegistry>{children}</ThemeRegistry>
			</body>
		</html>
	);
}

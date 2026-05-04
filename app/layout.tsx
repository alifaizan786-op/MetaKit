// app/layout.tsx
// Root layout — wraps every page with the ThemeRegistry (MUI + color mode)
// Also loads Google Fonts for Space Grotesk, DM Sans, and JetBrains Mono

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import ThemeRegistry from '@/components/ThemeRegistry';
import type { Metadata } from 'next';
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { cookies } from 'next/headers';

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	variable: '--font-space-grotesk',
});

const dmSans = DM_Sans({
	subsets: ['latin'],
	variable: '--font-dm-sans',
});

const jetBrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
	title: 'MetaKit — Website Meta & SEO Toolbox',
	description:
		'Audit Open Graph, Twitter Card, and standard meta tags for any URL. Free developer tool with a public REST API.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const cookieStore = await cookies();
	const themeCookie = cookieStore.get('metakit-theme');
	const initialMode = themeCookie?.value === 'dark' ? 'dark' : 'light';

	return (
		<html lang='en'>
			<body
				className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetBrainsMono.variable}`}
			>
				<ThemeRegistry initialMode={initialMode}>
					<NavBar />
					{children}
					<Footer />
				</ThemeRegistry>
			</body>
		</html>
	);
}
'use client';
// components/ThemeRegistry.tsx
// MUI requires special setup in Next.js App Router to avoid style flicker on SSR.
// This component wraps the app with the correct emotion cache and MUI ThemeProvider.
// It also reads the user's system color scheme preference and applies the matching theme.

import { darkTheme, lightTheme } from '@/lib/theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Context so any component can call useColorMode() to toggle the theme
interface ColorModeContextType {
	mode: 'light' | 'dark';
	toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
	mode: 'dark',
	toggleColorMode: () => {},
});

// Hook for consuming the theme toggle anywhere in the tree
export const useColorMode = () => useContext(ColorModeContext);

export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	// Initialize from system preference immediately — avoids calling setState inside effect
	const [mode, setMode] = useState<'light' | 'dark'>(() => {
		if (typeof window === 'undefined') return 'dark';
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	});

	useEffect(() => {
		// Only listen for changes — initial value already set in useState
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (e: MediaQueryListEvent) =>
			setMode(e.matches ? 'dark' : 'light');
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}, []);
	// Toggle handler — flips between light and dark
	const toggleColorMode = () => {
		setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
	};

	// Memoize the context value so it doesn't trigger re-renders on unrelated state changes
	const colorModeContext = useMemo(() => ({ mode, toggleColorMode }), [mode]);

	// Pick the theme based on current mode
	const theme = mode === 'dark' ? darkTheme : lightTheme;

	return (
		<ColorModeContext.Provider value={colorModeContext}>
			<ThemeProvider theme={theme}>
				{/* CssBaseline normalizes browser styles and applies MUI's background color */}
				<CssBaseline />
				{children}
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

// lib/theme.ts
// Central MUI theme config — imported by the ThemeRegistry
// We define both light and dark palettes here and switch based on system/user preference

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Shared design tokens used across both themes
const shared: ThemeOptions = {
	typography: {
		// JetBrains Mono for code/URLs — adds the developer-tool feel
		fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
		h1: {
			fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
			fontWeight: 700,
			letterSpacing: '-0.03em',
		},
		h2: {
			fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
			fontWeight: 700,
			letterSpacing: '-0.02em',
		},
		h3: {
			fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
			fontWeight: 600,
		},
		h4: {
			fontFamily: '"Space Grotesk", "DM Sans", sans-serif',
			fontWeight: 600,
		},
		// monospace variant for URLs, code, keys
		caption: {
			fontFamily: '"JetBrains Mono", "Fira Code", monospace',
			fontSize: '0.75rem',
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none', // avoid ALL CAPS buttons
					fontWeight: 600,
					letterSpacing: '0.01em',
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontFamily: '"JetBrains Mono", monospace',
					fontSize: '0.7rem',
				},
			},
		},
	},
};

// Dark theme — primary surface is deep charcoal, accent is electric green
export const darkTheme = createTheme({
	...shared,
	palette: {
		mode: 'dark',
		primary: {
			main: '#00E5A0', // electric green — the signature accent
			contrastText: '#0A0F0D',
		},
		secondary: {
			main: '#00B4D8', // cyan for secondary actions
		},
		background: {
			default: '#0A0F0D', // near-black with green tint
			paper: '#111714', // slightly lighter for cards
		},
		error: {
			main: '#FF4D6D',
		},
		warning: {
			main: '#FFB703',
		},
		info: {
			main: '#00B4D8',
		},
		success: {
			main: '#00E5A0',
		},
		divider: 'rgba(0, 229, 160, 0.12)',
		text: {
			primary: '#E8F5F0',
			secondary: '#8BA899',
		},
	},
});

// Light theme — clean off-white, same accent green
export const lightTheme = createTheme({
	...shared,
	palette: {
		mode: 'light',
		primary: {
			main: '#00A372', // slightly deeper green for light bg readability
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#0077A8',
		},
		background: {
			default: '#F4FAF7', // very slight green tint on white
			paper: '#FFFFFF',
		},
		error: {
			main: '#D93B55',
		},
		warning: {
			main: '#E07B00',
		},
		info: {
			main: '#0077A8',
		},
		success: {
			main: '#00A372',
		},
		divider: 'rgba(0, 163, 114, 0.15)',
		text: {
			primary: '#0D1F18',
			secondary: '#4A6B5C',
		},
	},
});

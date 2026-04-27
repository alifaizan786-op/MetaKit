'use client';
// components/ThemeToggle.tsx
// A simple icon button that toggles between light and dark mode.
// Reads and writes through the ColorModeContext provided by ThemeRegistry.

import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { IconButton, Tooltip } from '@mui/material';
import { useColorMode } from './ThemeRegistry';

export default function ThemeToggle() {
	const { mode, toggleColorMode } = useColorMode();

	return (
		<Tooltip
			title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
			<IconButton onClick={toggleColorMode} size='small' color='inherit'>
				{mode === 'dark' ? (
					<LightModeRoundedIcon fontSize='small' />
				) : (
					<DarkModeRoundedIcon fontSize='small' />
				)}
			</IconButton>
		</Tooltip>
	);
}

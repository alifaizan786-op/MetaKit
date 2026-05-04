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
			<IconButton
				onClick={toggleColorMode}
				size='small'
				color='inherit'
				sx={{
					border: '1px solid',
					borderColor: 'divider',
					borderRadius: 1,
				}}>
				{mode === 'dark' ? (
					<LightModeRoundedIcon
						fontSize='small'
						sx={{ color: 'text.primary' }}
					/>
				) : (
					<DarkModeRoundedIcon
						fontSize='small'
						sx={{ color: 'text.primary' }}
					/>
				)}
			</IconButton>
		</Tooltip>
	);
}

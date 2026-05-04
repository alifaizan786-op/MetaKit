'use client';
// app/page.tsx
// The main MetaKit auditor page.
// User pastes a URL → hits Audit → sees meta tag results + social card previews side by side.
// State machine: idle → loading → results | error

import { Box, Chip, Typography } from '@mui/material';

interface StatusObj {
    pageStatus: { status: number; statusText: string };
    cached: boolean;
    auditedAt: string;
}

export default function Status({statusObj}:{statusObj:StatusObj}) {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1,
				flexWrap: 'wrap',
			}}>
			<Chip
				label={`${statusObj.pageStatus.status} ${statusObj.pageStatus.statusText}`}
				color={statusObj.pageStatus.status === 200 ? 'success' : 'error'}
				size='small'
			/>
			<Chip
				label={statusObj.cached ? 'Cached' : 'Live'}
				variant='outlined'
				size='small'
				color={statusObj.cached ? 'info' : 'default'}
			/>
			<Typography variant='caption' color='text.secondary'>
				Audited {new Date(statusObj.auditedAt).toLocaleTimeString()}
			</Typography>
		</Box>
	);
}

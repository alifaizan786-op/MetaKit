'use client';
// components/WarningsList.tsx
// Renders the warnings array from an audit result.
// Each warning gets a colored chip based on severity: error (red), warning (amber), info (blue).
// Groups by severity so errors always appear first.

import { Warning } from '@/types/audit';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Box, Chip, Typography, Grid, Paper } from '@mui/material';

interface WarningsListProps {
	warnings: Warning[];
}

// Map severity to MUI color + icon
const severityConfig = {
	error: {
		color: 'error' as const,
		icon: <ErrorRoundedIcon fontSize='small' />,
		label: 'Error',
	},
	warning: {
		color: 'warning' as const,
		icon: <WarningAmberRoundedIcon fontSize='small' />,
		label: 'Warning',
	},
	info: {
		color: 'info' as const,
		icon: <InfoRoundedIcon fontSize='small' />,
		label: 'Info',
	},
};

// Sort order: errors first, then warnings, then info
const severityOrder = { error: 0, warning: 1, info: 2 };

export default function WarningsList({ warnings }: WarningsListProps) {
	if (!warnings || warnings.length === 0) {
		// All clear state
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
				<CheckCircleRoundedIcon color='success' />
				<Typography color='success.main' sx={{ fontWeight: 600 }}>
					No issues found — this page looks great.
				</Typography>
			</Box>
		);
	}

	// Sort warnings by severity before rendering
	const sorted = [...warnings].sort(
		(a, b) => severityOrder[a.severity] - severityOrder[b.severity],
	);

	// Summary counts
	const errorCount = warnings.filter((w) => w.severity === 'error').length;
	const warningCount = warnings.filter((w) => w.severity === 'warning').length;
	const infoCount = warnings.filter((w) => w.severity === 'info').length;

	return (
	
			<Paper sx={{ p: 2.5 }} variant='outlined'>
				<Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
					Issues
				</Typography>
				<Box>
					{/* Summary bar */}
					<Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
						{errorCount > 0 && (
							<Chip
								label={`${errorCount} error${errorCount > 1 ? 's' : ''}`}
								color='error'
								size='small'
								icon={<ErrorRoundedIcon />}
							/>
						)}
						{warningCount > 0 && (
							<Chip
								label={`${warningCount} warning${warningCount > 1 ? 's' : ''}`}
								color='warning'
								size='small'
								icon={<WarningAmberRoundedIcon />}
							/>
						)}
						{infoCount > 0 && (
							<Chip
								label={`${infoCount} info`}
								color='info'
								size='small'
								icon={<InfoRoundedIcon />}
							/>
						)}
					</Box>

					{/* Warning rows */}
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: {
								xs: 'repeat(2, 1fr)',
								md: 'repeat(3, 1fr)',
							},
							gap: 1,
						}}>
						{sorted.map((warning, index) => {
							const config = severityConfig[warning.severity];
							return (
								<Box
									key={index}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1.5,
										py: 1,
										px: 1.5,
										borderRadius: 1,
										backgroundColor: `${config.color}.main`,
										// Very subtle tinted background
										bgcolor: (theme) =>
											theme.palette.mode === 'dark'
												? `${config.color}.dark`
												: `${config.color}.light`,
										opacity: 0.9,
									}}>
									<Box
										sx={{
											color: `${config.color}.main`,
											display: 'flex',
											alignItems: 'center',
										}}>
										{config.icon}
									</Box>
									<Typography
										variant='body2'
										sx={{
											fontFamily: '"DM Sans", sans-serif',
											fontWeight: 500,
										}}>
										{warning.message}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
			</Paper>
	);
}

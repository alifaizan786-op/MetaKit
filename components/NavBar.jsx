import ThemeToggle from '@/components/ThemeToggle';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { AppBar, Box, Link, Toolbar, Typography } from '@mui/material';

export default function NavBar() {
	return (
		<AppBar
			position='sticky'
			elevation={0}
			sx={{
				borderBottom: '1px solid',
				borderColor: 'divider',
				backgroundColor: 'background.paper',
			}}>
			<Toolbar sx={{ gap: 2 }}>
				{/* Logo */}
				<Link href='/' underline='none' sx={{ flex: 1 }}>
					<Typography
						variant='h6'
						sx={{
							fontFamily: '"Space Grotesk", sans-serif',
							fontWeight: 700,
							color: 'primary.main',
							letterSpacing: '-0.02em',
						}}>
						Meta
						<Box component='span' sx={{ color: 'text.primary' }}>
							Kit
						</Box>
					</Typography>
				</Link>

				{/* Nav links — Box flex avoids passing layout props to DOM anchor tags */}
				<Link
					href='/history'
					underline='none'
					color='text.secondary'
					sx={{
						fontSize: '0.9rem',
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
					}}>
					<HistoryRoundedIcon fontSize='small' />
					History
				</Link>

				<Link
					href='/docs'
					underline='none'
					color='text.secondary'
					sx={{
						fontSize: '0.9rem',
						display: 'flex',
						alignItems: 'center',
						gap: 0.5,
					}}>
					<MenuBookRoundedIcon fontSize='small' />
					API Docs
				</Link>

				<ThemeToggle />
			</Toolbar>
		</AppBar>
	);
}

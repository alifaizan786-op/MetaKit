import { Box, Link, Typography } from '@mui/material';

export default function Footer() {
	return (
		<Box
			component='footer'
			sx={{
				mt: 'auto',
				py: 3,
				borderTop: '1px solid',
				borderColor: 'divider',
				textAlign: 'center',
			}}>
			<Typography variant='caption' color='text.secondary'>
				MetaKit — Built by{' '}
				<Link
					href='https://linkedin.com/in/alifaizan786'
					target='_blank'
					color='primary.main'>
					Faizan Ali
				</Link>
				{' · '}
				<Link href='/docs' color='text.secondary'>
					API Docs
				</Link>
				{' · '}
				<Link
					href='https://github.com/alifaizan786-op/MetaKit'
					target='_blank'
					color='text.secondary'>
					GitHub
				</Link>
			</Typography>
		</Box>
	);
}

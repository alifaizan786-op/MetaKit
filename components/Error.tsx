import { Alert, Container } from '@mui/material';

export default function Error({ message } : { message: string }) {
	return (
		<Container maxWidth='md' sx={{ mt: 3 }}>
			<Alert severity='error'>{message}</Alert>
		</Container>
	);
}

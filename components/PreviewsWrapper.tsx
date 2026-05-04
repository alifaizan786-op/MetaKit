import FacebookPreview from '@/components/previews/FacebookPreview';
import LinkedInPreview from '@/components/previews/LinkedInPreview';
import SlackPreview from '@/components/previews/SlackPreview';
import TwitterPreview from '@/components/previews/TwitterPreview';
import { Meta } from '@/types/audit';

import { Box, Paper, Typography } from '@mui/material';

export default function PreviewsWrapper({
	metaTagObj,
	url,
}: {
	metaTagObj: Meta;
	url: string;
}) {
	return (
		<Paper sx={{ p: 2.5 }} variant='outlined'>
			<Typography variant='h6' sx={{ fontWeight: 700, mb: 1 }}>
				Platform Previews
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
				How this URL appears when shared on each platform.
			</Typography>

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
				<FacebookPreview
					title={metaTagObj.og.title || metaTagObj.title}
					description={metaTagObj.og.description || metaTagObj.description}
					image={metaTagObj.og.image}
					url={url}
				/>
				<TwitterPreview
					title={
						metaTagObj.twitter.title || metaTagObj.og.title || metaTagObj.title
					}
					description={
						metaTagObj.twitter.description ||
						metaTagObj.og.description ||
						metaTagObj.description
					}
					image={metaTagObj.twitter.image || metaTagObj.og.image}
					url={url}
				/>
				<LinkedInPreview
					title={metaTagObj.og.title || metaTagObj.title}
					description={metaTagObj.og.description || metaTagObj.description}
					image={metaTagObj.og.image}
					url={url}
				/>
				<SlackPreview
					title={metaTagObj.og.title || metaTagObj.title}
					description={metaTagObj.og.description || metaTagObj.description}
					image={metaTagObj.og.image}
					url={url}
				/>
			</Box>
		</Paper>
	);
}

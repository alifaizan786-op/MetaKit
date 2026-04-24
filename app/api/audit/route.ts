// app/api/audit/route.ts
import { parseMetaTags } from '@/lib/metaParser';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  
  const result = await parseMetaTags(url);
  
  return Response.json(result);
}
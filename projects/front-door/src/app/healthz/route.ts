export const dynamic = 'force-static';

export async function GET() {
  return Response.json({ message: 'KevChat frontdoor is up!' });
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { days_to_seconds } from '../../lib/to_seconds';
import { getTrendingResults } from '../../lib/trending';

export default async function Trending(req: NextApiRequest, res: NextApiResponse) {
  const data = await getTrendingResults();
  const maxAge = days_to_seconds(1); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(data);
}
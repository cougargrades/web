// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTrendingResults } from '../../lib/trending';

export default async function Trending(req: NextApiRequest, res: NextApiResponse) {
  const data = await getTrendingResults();
  const maxAge = 86400; // 1 day in seconds
  res.setHeader('Cache-Control', `s-maxage=${maxAge}, stale-while-revalidate=${maxAge}`);
  res.json(data);
}
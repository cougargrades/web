// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTrending } from '../../lib/trending';

export default async function Trending(req: NextApiRequest, res: NextApiResponse) {
  const data = await getTrending();
  const cacheDuration = 259200; // 3 days in seconds
  res.setHeader('Cache-Control', `s-maxage=1, stale-while-revalidate=${cacheDuration}`);
  res.json(data);
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTrending } from '../../lib/trending';

export default async function Trending(req: NextApiRequest, res: NextApiResponse) {
  const data = await getTrending();
  res.json(data);
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../lib/cache'
import { getLatestTerm } from '../../lib/data/back/getLatestTerm';

export interface LatestTermResult {
  latestTerm: number | null;
}

export default async function GetLatestTerm(req: NextApiRequest, res: NextApiResponse<LatestTermResult>) {
  const result = await getLatestTerm();
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json({
    latestTerm: result,
  });
}
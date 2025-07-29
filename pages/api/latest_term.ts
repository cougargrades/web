// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { LATEST_TERM_CACHE_LIFETIME, TEMPORAL_CACHE_CONTROL } from '../../lib/cache'
import { getLatestTerm } from '../../lib/data/back/getLatestTerm';

export interface LatestTermResult {
  latestTerm: number | null;
}

export default async function GetLatestTerm(req: NextApiRequest, res: NextApiResponse<LatestTermResult>) {
  const result = await getLatestTerm();
  res.setHeader('Cache-Control', TEMPORAL_CACHE_CONTROL(LATEST_TERM_CACHE_LIFETIME));
  res.json({
    latestTerm: result,
  });
}
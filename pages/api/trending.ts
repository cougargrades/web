// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { TEMPORAL_CACHE_CONTROL, TRENDING_CACHE_LIFETIME } from '../../lib/cache'
import { SearchResult } from '../../lib/data/useSearchResults'
import { getTrendingResults } from '../../lib/trending'
import { extract } from '../../lib/util';

export default async function Trending(req: NextApiRequest, res: NextApiResponse<SearchResult[]>) {
  const limit: number = parseInt(extract(req.query['limit']));
  const DEFAULT_LIMIT = 5
  const realLimit: number = isNaN(limit) ? DEFAULT_LIMIT : limit < 0 || limit > 10 ? DEFAULT_LIMIT : limit; 
  const data = await getTrendingResults(realLimit);
  res.setHeader('Cache-Control', TEMPORAL_CACHE_CONTROL(TRENDING_CACHE_LIFETIME));
  res.json(data);
}
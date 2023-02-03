// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../lib/cache'
import { SearchResult } from '../../lib/data/useSearchResults'
import { getTrendingResults } from '../../lib/trending'

export default async function Trending(req: NextApiRequest, res: NextApiResponse<SearchResult[]>) {
  const data = await getTrendingResults();
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(data);
}
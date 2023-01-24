// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../lib/cache'
import { getSearchResults, SearchResult } from '../../lib/data/useSearchResults'
import { extract } from '../../lib/util'

export default async function Search(req: NextApiRequest, res: NextApiResponse<SearchResult[]>) {
  const { q } = req.query;
  const data = q !== undefined ? await getSearchResults(extract(q)) : [];
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(data);
}
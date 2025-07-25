// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../lib/cache'
import { SearchResultType, SearchResult } from '../../lib/data/useSearchResults'
import { getSearchResults } from '../../lib/data/back/getSearchResults'
import { extract } from '../../lib/util'

export default async function Search(req: NextApiRequest, res: NextApiResponse<SearchResult[]>) {
  const { q, t } = req.query;
  const parsedType = SearchResultType.safeParse(t);
  const typeFilter = parsedType.success ? parsedType.data : null;
  const data = q !== undefined ? await getSearchResults(extract(q), typeFilter) : [];
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(data);
}
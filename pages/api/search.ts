// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSearchResults, SearchResult } from '../../lib/data/useSearchResults';
import { days_to_seconds } from '../../lib/to_seconds';
import { extract } from '../../lib/util'

export default async function Search(req: NextApiRequest, res: NextApiResponse<SearchResult[]>) {
  const { q } = req.query;
  const data = q !== undefined ? await getSearchResults(extract(q)) : [];
  const maxAge = days_to_seconds(1); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(data);
}
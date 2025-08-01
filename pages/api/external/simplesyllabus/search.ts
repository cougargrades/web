// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { TEMPORAL_CACHE_CONTROL } from '../../../../lib/cache'
import * as simplesyllabus from '../../../../lib/data/back/simplesyllabus'
import { SYLLABUS_CACHE_LIFETIME } from '../../../../lib/data/simplesyllabus'
import { extract } from '../../../../lib/util'


export default async function SearchSyllabi(req: NextApiRequest, res: NextApiResponse<Awaited<ReturnType<typeof simplesyllabus.search>>>) {
  const { query, strict } = req.query;
  const SEARCH_STRICTLY = JSON.parse(extract(strict)) === true

  let result = await simplesyllabus.search(extract(query))
  if (SEARCH_STRICTLY && result?.sys.success === true && result.items) {
    result.items = result.items.filter(r => r.title.toLowerCase().includes(extract(query).toLowerCase()));
  }
  res.setHeader('Cache-Control', TEMPORAL_CACHE_CONTROL(SYLLABUS_CACHE_LIFETIME));
  res.json(result);
}

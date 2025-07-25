// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Instructor } from '@cougargrades/types'
import { LIVE_CACHE_CONTROL } from '../../../lib/cache'
import { getRandomInstuctors } from '../../../lib/data/back/getRandomInstructors'
import { extract } from '../../../lib/util'

export default async function RandomInstructor(req: NextApiRequest, res: NextApiResponse<Instructor[]>) {
  const limit: number = parseInt(extract(req.query['limit']));
  const DEFAULT_LIMIT = 1
  const valid = !isNaN(limit) && limit > 0 && limit <= 15
  const data = await getRandomInstuctors(valid ? limit : DEFAULT_LIMIT)
  res.setHeader('Cache-Control', LIVE_CACHE_CONTROL);
  res.json(data);
}

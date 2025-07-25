// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../lib/cache'
import { getInstructorData } from '../../../lib/data/back/getInstructorData'
import { InstructorResult } from '../../../lib/data/useInstructorData'
import { extract } from '../../../lib/util'

export default async function GetInstructorData(req: NextApiRequest, res: NextApiResponse<InstructorResult>) {
  const { instructorName } = req.query;
  const result = await getInstructorData(extract(instructorName))
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(result);
}
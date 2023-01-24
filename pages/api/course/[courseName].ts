// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../lib/cache'
import { CourseResult, getCourseData } from '../../../lib/data/useCourseData'
import { extract } from '../../../lib/util'

export default async function GetCourseData(req: NextApiRequest, res: NextApiResponse<CourseResult>) {
  const { courseName } = req.query;
  const result = await getCourseData(extract(courseName))
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(result);
}
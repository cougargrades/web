// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CourseResult, getCourseData } from '../../../lib/data/useCourseData';
import { days_to_seconds } from '../../../lib/to_seconds';
import { extract } from '../../../lib/util';

export default async function GetCourseData(req: NextApiRequest, res: NextApiResponse<CourseResult>) {
  const { courseName } = req.query;
  const result = await getCourseData(extract(courseName))
  const maxAge = days_to_seconds(7); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(result);
}
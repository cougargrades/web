// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { InstructorResult, getInstructorData } from '../../../lib/data/useInstructorData';
import { days_to_seconds } from '../../../lib/to_seconds';
import { extract } from '../../../lib/util';

export default async function GetInstructorData(req: NextApiRequest, res: NextApiResponse<InstructorResult>) {
  //const data = await getTrendingResults();
  const { instructorName } = req.query;
  const result = await getInstructorData(extract(instructorName))
  const maxAge = days_to_seconds(7); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(result);
}
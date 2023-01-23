// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PopulatedGroupResult, getOneGroup } from '../../../../lib/data/useAllGroups';
import { days_to_seconds } from '../../../../lib/to_seconds';
import { extract } from '../../../../lib/util';

export default async function GetOneGroup(req: NextApiRequest, res: NextApiResponse<PopulatedGroupResult>) {
  const { groupId } = req.query;
  const result = await getOneGroup(extract(groupId), true)
  const maxAge = days_to_seconds(7); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(result);
}
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../../lib/cache'
import { PopulatedGroupResult, getOneGroup } from '../../../../lib/data/useAllGroups'
import { extract } from '../../../../lib/util'

export default async function GetOneGroup(req: NextApiRequest, res: NextApiResponse<PopulatedGroupResult>) {
  const { groupId } = req.query;
  const result = await getOneGroup(extract(groupId))
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(result);
}
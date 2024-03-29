// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../../lib/cache'
import { getOneGroup } from '../../../../lib/data/back/getOneGroup';
import { PopulatedGroupResult } from '../../../../lib/data/useAllGroups'
import { extract } from '../../../../lib/util'

export default async function GetOneGroup(req: NextApiRequest, res: NextApiResponse<PopulatedGroupResult>) {
  const { groupId } = req.query;
  //const result = await getOneGroup(extract(groupId), true)
  res.setHeader('Cache-Control', CACHE_CONTROL)
  res.statusCode = 400;
  res.end('Temporarily disabled')
  //res.json(result);
}
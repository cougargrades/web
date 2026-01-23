// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../../lib/cache'
import { getOneGroup } from '../../../../lib/data/back/getOneGroup';
import { PopulatedGroupResult } from '../../../../lib/data/useAllGroups'
import { extract } from '../../../../lib/util'

export default async function GetOneGroup(req: NextApiRequest, res: NextApiResponse<PopulatedGroupResult>) {
  const { groupId } = req.query;
  const result = await getOneGroup(extract(groupId))
  res.setHeader('Cache-Control', CACHE_CONTROL);
  if (result) {
    res.json(result);
  }
  else {
    res.statusCode = 404;
    res.send('Group Not Found' as any);
  }
}
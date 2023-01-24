// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL } from '../../../lib/cache'
import { AllGroupsResult, getAllGroups } from '../../../lib/data/useAllGroups'

export default async function GetAllGroups(req: NextApiRequest, res: NextApiResponse<AllGroupsResult>) {
  const result = await getAllGroups();
  res.setHeader('Cache-Control', CACHE_CONTROL);
  res.json(result);
}
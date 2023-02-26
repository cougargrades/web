// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL, MAINTENANCE_CACHE_CONTROL } from '../../lib/cache'
import { getDeploymentInfo, MaintenanceResult } from '../../lib/maintenance'

export default async function Maintenance(req: NextApiRequest, res: NextApiResponse<MaintenanceResult[]>) {
  let data: MaintenanceResult[] = []
  // Because GitHub for some reason doesn't like my home IP address
  try {
    data = await getDeploymentInfo()
  }
  catch {
    data = []
  }
  res.setHeader('Cache-Control', MAINTENANCE_CACHE_CONTROL);
  res.json(data);
}
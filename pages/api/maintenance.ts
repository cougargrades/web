// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { CACHE_CONTROL, ON_MAINTENANCE_CACHE_CONTROL, OFF_MAINTENANCE_CACHE_CONTROL } from '../../lib/cache'
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
  // Use a different cache pattern depending on if we're deploying or now, we don't want to waste resources, but we want it to be visible
  const IS_DEPLOYING = data.some(e => e.progress !== null);
  res.setHeader('Cache-Control', IS_DEPLOYING ? ON_MAINTENANCE_CACHE_CONTROL : OFF_MAINTENANCE_CACHE_CONTROL);
  res.json(data);
}
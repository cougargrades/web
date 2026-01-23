// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PROD_CACHE_LIFETIME, TEMPORAL_CACHE_CONTROL, TOP_RECENT_CACHE_LIFETIME } from '../../lib/cache'
import { getTopResults, TopLimit, TopMetric, TopTime, TopTopic } from '../../lib/data/back/getTopResults'
import { CoursePlusMetrics, InstructorPlusMetrics } from '../../lib/trending'
import { extract } from '../../lib/util'

const TOP_UPPER_LIMIT = 250

export default async function Top(req: NextApiRequest, res: NextApiResponse<(CoursePlusMetrics | InstructorPlusMetrics)[]>) {
  // extract query strings
  const metric: TopMetric = extract(req.query['metric']) as TopMetric;
  const topic: TopTopic = extract(req.query['topic']) as TopTopic;
  const limit: TopLimit = parseInt(extract(req.query['limit'])) as TopLimit;
  const time: TopTime = extract(req.query['time']) as TopTime;
  const hideCore: boolean = extract(req.query['hideCore']) === 'true'
  // validate query strings
  const valid: boolean = ['course', 'instructor'].includes(topic)
    && !isNaN(limit) && limit > 0 && limit <= TOP_UPPER_LIMIT
    && ['totalEnrolled', 'activeUsers', 'screenPageViews'].includes(metric);
  // fetch results
  const data = valid ? await getTopResults({ metric, topic, limit, time, hideCore }) : [];
  // determine cache control by the recency of the records requested ()
  const cacheLifetime = time === 'all' ? PROD_CACHE_LIFETIME : TOP_RECENT_CACHE_LIFETIME;
  res.setHeader('Cache-Control', TEMPORAL_CACHE_CONTROL(cacheLifetime));
  res.json(data);
}
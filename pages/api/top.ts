// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTopResults, TopLimit, TopMetric, TopTime, TopTopic } from '../../lib/top_back';
import { days_to_seconds } from '../../lib/to_seconds';
import { CoursePlusMetrics, InstructorPlusMetrics } from '../../lib/trending';
import { extract } from '../../lib/util'

export default async function Top(req: NextApiRequest, res: NextApiResponse<(CoursePlusMetrics | InstructorPlusMetrics)[]>) {
  // extract query strings
  const metric: TopMetric = extract(req.query['metric']) as TopMetric;
  const topic: TopTopic = extract(req.query['topic']) as TopTopic;
  const limit: TopLimit = parseInt(extract(req.query['limit'])) as TopLimit;
  const time: TopTime = extract(req.query['time']) as TopTime;
  // validate query strings
  const valid: boolean = ['course', 'instructor'].includes(topic)
    && !isNaN(limit) && limit > 0 && limit <= 100
    && ['totalEnrolled', 'activeUsers', 'screenPageViews'].includes(metric);
  // fetch results
  const data = valid ? await getTopResults({ metric, topic, limit, time }) : [];
  const maxAge = days_to_seconds(1); // 1 day in seconds
  res.setHeader('Cache-Control', `public, must-revalidate, max-age=${maxAge}`);
  res.json(data);
}
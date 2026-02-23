
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { env } from 'cloudflare:workers'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { PopCon, PopConMetric } from '@cougargrades/models'
import { DURATION_ZERO } from '../cache'
import { CourseOrInstructorPlusMetrics, getTopResults } from '../lib/getTopResults'

import { recordPopCon } from '../lib/popconHelper'

const app = new Hono()

app.post('/submit',
  validator('query', z.object({
    pathname: z.string(),
    //type: z.coerce.number(),
    type: z.preprocess(val => typeof val === 'string' ? Number.parseInt(val) : val, z.enum(PopConMetric))
  })),
  describeRoute({
    description: `
    This is anonymized service for tracking when a Course or Instructor is "viewed" (but never by who), which influences the "Most Viewed" pages and the "Trending/Popular" search results feature.
    Only what is submitted is collected. Submissions to this endpoint are rate limited and validated.
    The naming of this service was inspired by the <a href="https://popcon.debian.org/">Debian Popularity Contest</a> system.
    `.trim(),
  }),
  cache({
    cacheName: 'cougargrades-api',
    // TODO: use real cache time
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    if (!env.POPULARITY_CONTEST) return ctx.newResponse('', 429);
    const { pathname, type } = ctx.req.valid('query');

    const ipAddress = ctx.req.header('cf-connecting-ip') ?? '';
    const rateLimitKey = `${ipAddress} >> ${ctx.req.url}`;

    const { success } = await env.POPULARITY_CONTEST.limit({ key: rateLimitKey });

    if (success) {
      await recordPopCon({ pathname, type });
      return ctx.newResponse('', 200)
    }
    else {
      return ctx.newResponse('Rate limit exceeded', 429)
    }
  }
)

export default app
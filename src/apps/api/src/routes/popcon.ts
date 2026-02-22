
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { env } from 'cloudflare:workers'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { PopCon } from '@cougargrades/models'
import { DURATION_ZERO } from '../cache'
import { CourseOrInstructorPlusMetrics, getTopResults } from '../lib/getTopResults'

import { recordPopCon } from '../lib/popconHelper'

const app = new Hono()

app.post('/submit',
  validator('query', z.object({
    pathname: z.string(),
    type: z.coerce.number(),
  })),
  // describeRoute({
  //   responses: {
  //     200: {
  //       description: '',
  //       content: {
  //         'application/json': { schema: resolver(CourseOrInstructorPlusMetrics.array()) }
  //       }
  //     }
  //   }
  // }),
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
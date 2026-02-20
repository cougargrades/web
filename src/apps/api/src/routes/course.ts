
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { TopOptions } from '@cougargrades/models/dto'
import { DURATION_ZERO } from '../cache'
import { getCourseData } from '../lib/getCourseResults'

const app = new Hono()

app.get('/:courseName',
  zValidator('param', z.object({
    courseName: z.string()
  })),
  cache({
    cacheName: 'cougargrades-api',
    // TODO: use real cache time
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  }),
  async (ctx) => {
    const { courseName } = ctx.req.valid('param');
    const results = await getCourseData(courseName);

    //const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json(results);
  }
)

export default app
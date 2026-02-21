
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { DURATION_ZERO } from '../cache'
import { getCourseResults } from '../lib/getCourseResults'
import { CourseResult } from '@cougargrades/models/dto'

const app = new Hono()

app.get('/:courseName',
  zValidator('param', z.object({
    courseName: z.string()
  })),
  // describeRoute({
  //   responses: {
  //     200: {
  //       description: '',
  //       content: {
  //         'application/json': { schema: resolver(CourseResult) }
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
    const { courseName } = ctx.req.valid('param');
    const results = await getCourseResults(courseName);
    return ctx.json(results);
  }
)

export default app
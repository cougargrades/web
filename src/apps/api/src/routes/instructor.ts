
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { describeRoute, resolver } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { DURATION_ZERO } from '../cache'
import { getInstructorResults } from '../lib/getInstructorData'
import { InstructorResult } from '@cougargrades/models/dto'

const app = new Hono()

app.get('/:instructorName',
  zValidator('param', z.object({
    instructorName: z.string()
  })),
  // describeRoute({
  //   responses: {
  //     200: {
  //       description: '',
  //       content: {
  //         'application/json': { schema: resolver(InstructorResult) }
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
    const { instructorName } = ctx.req.valid('param');
    const results = await getInstructorResults(instructorName);
    return ctx.json(results);
    //return ctx.json(123)
  }
)

export default app
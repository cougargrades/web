
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { DURATION_ZERO, NO_CACHE, PROD_CACHE_LIFETIME } from '../cache'
import { getInstructorResults } from '../lib/getInstructorResults'
import { InstructorResult } from '@cougargrades/models/dto'

const app = new Hono()

app.get('/:instructorName',
  validator('param', z.object({
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
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(PROD_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { instructorName } = ctx.req.valid('param');
    const results = await getInstructorResults(instructorName);
    return ctx.json(results);
    //return ctx.json(123)
  }
)

export default app
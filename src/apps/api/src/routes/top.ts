
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { RankingResult, TopOptions, TopResult } from '@cougargrades/models/dto'
import { DURATION_ZERO, NO_CACHE } from '../cache'
import { getRankForCourse, getRankForInstructor, getSparklineForCourse, getSparklineForInstructor, getTopResults } from '../lib/getTopResults'
import { BinnedSparklineData, SparklineData } from '@cougargrades/models'

export const TOP_RECENT_CACHE_LIFETIME = Temporal.Duration.from({ days: 7 });

const app = new Hono()

app.get('/',
  validator('query', TopOptions),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(TopResult.array()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(TOP_RECENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { metric, topic, limit, time, hideCore } = ctx.req.valid('query');

    const results = await getTopResults({ metric, topic, limit, time, hideCore })
    return ctx.json(results);
  }
)
.get('/rank/course/:courseName',
  validator('param', z.object({
    courseName: z.string()
  })),
  validator('query', TopOptions.pick({ metric: true, time: true })),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(RankingResult.nullable()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(TOP_RECENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { courseName } = ctx.req.valid('param');
    const { metric, time } = ctx.req.valid('query');

    const rank = await getRankForCourse(courseName, { metric, time });
    return ctx.json(rank);
  }
)
.get('/rank/instructor/:instructorName',
  validator('param', z.object({
    instructorName: z.string()
  })),
  validator('query', TopOptions.pick({ metric: true, time: true })),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(RankingResult.nullable()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(TOP_RECENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { instructorName } = ctx.req.valid('param');
    const { metric, time } = ctx.req.valid('query');

    const rank = await getRankForInstructor(instructorName, { metric, time });
    return ctx.json(rank);
  }
)
.get('/sparkline/course/:courseName',
  validator('param', z.object({
    courseName: z.string()
  })),
  validator('query', TopOptions.pick({ metric: true, time: true })),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(BinnedSparklineData.nullable()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(TOP_RECENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { courseName } = ctx.req.valid('param');
    const { metric, time } = ctx.req.valid('query');

    const rank = await getSparklineForCourse(courseName, { metric, time });
    return ctx.json(rank);
  }
)
.get('/sparkline/instructor/:instructorName',
  validator('param', z.object({
    instructorName: z.string()
  })),
  validator('query', TopOptions.pick({ metric: true, time: true })),
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(BinnedSparklineData.nullable()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(TOP_RECENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { instructorName } = ctx.req.valid('param');
    const { metric, time } = ctx.req.valid('query');

    const rank = await getSparklineForInstructor(instructorName, { metric, time });
    return ctx.json(rank);
  }
)

export default app
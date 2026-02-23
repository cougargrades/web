
import { Hono } from 'hono'
import { describeRoute, validator } from 'hono-openapi'
import { z } from 'zod'
import { env } from 'cloudflare:workers'
import { PopConMetric } from '@cougargrades/models'

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
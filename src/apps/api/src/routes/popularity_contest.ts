
import { Hono } from 'hono'
import { describeRoute, validator } from 'hono-openapi'
import { z } from 'zod'
import { env } from 'cloudflare:workers'
import { PopConMetric } from '@cougargrades/models'
import { validateTurnstile } from '@cougargrades/vendor/cloudflare-turnstile'

import { recordPopCon } from '../lib/popconHelper'
import { NO_TURNSTILE } from '../cache'

const app = new Hono()

app.post('/submit',
  validator('query', z.object({
    pathname: z.string(),
    //type: z.coerce.number(),
    type: z.preprocess(val => typeof val === 'string' ? Number.parseInt(val) : val, z.enum(PopConMetric))
  })),
  validator('form', z.object({
    turnstile_token: z.string(),
  })),
  describeRoute({
    description: `
    This is anonymized service for tracking when a Course or Instructor is "viewed" (but never by who), which influences the "Most Viewed" pages and the "Trending/Popular" search results feature.
    Only what is submitted is collected. Submissions to this endpoint are rate limited and validated.
    The naming of this service was inspired by the <a href="https://popcon.debian.org/">Debian Popularity Contest</a> system.
    `.trim(),
  }),
  async (ctx) => {
    //if (!env.POPULARITY_CONTEST) return ctx.newResponse('', 429);
    const { pathname, type } = ctx.req.valid('query');
    const { turnstile_token } = ctx.req.valid('form');

    const turnstileResponse = await validateTurnstile(env.CF_TURNSTILE_SECRET_KEY, turnstile_token, ctx.req.header('cf-connecting-ip'));

    if (turnstileResponse.success || NO_TURNSTILE) {
      await recordPopCon({ pathname, type });
      return ctx.newResponse('', 200)
    }
    else {
      console.log('Turnstile failed: ', turnstileResponse);
      return ctx.newResponse('Rate limit exceeded', 429);
    }
  }
)

export default app
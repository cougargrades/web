
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver, validator } from 'hono-openapi'
import { z } from 'zod'
import { getContributors, getSponsorInformation } from '@cougargrades/vendor/github'
import { ContributorsResponse, SponsorResponse } from '@cougargrades/models/dto'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Temporal } from 'temporal-polyfill'
import { octokit } from '../../lib/github-config'
import { DEFAULT_CLIENT_CACHE_LIFETIME, NO_CACHE } from '../../cache'

export const GITHUB_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ days: 1 });

const app = new Hono()

app.get('/contributors',
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(ContributorsResponse) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(GITHUB_CACHE_LIFETIME, DEFAULT_CLIENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const gh = octokit();
    const results = await getContributors(gh);
    return ctx.json(results);
  }
)
.get('/sponsors',
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(SponsorResponse) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(GITHUB_CACHE_LIFETIME, DEFAULT_CLIENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const gh = octokit();
    const results = await getSponsorInformation(gh);
    return ctx.json(results);
  }
)

export default app

import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as rmp from '@cougargrades/vendor/rmp'
import type { RMPRankedSearchResult } from '@cougargrades/vendor/rmp'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Temporal } from 'temporal-polyfill'
import { diceCoefficient } from 'dice-coefficient'
import { DEFAULT_CLIENT_CACHE_LIFETIME } from '../cache'

export const RMP_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ days: 14 });

const app = new Hono()

app.get('/search',
  zValidator('query', z.object({
    query: z.string().nonempty(),
    strict: z.coerce.boolean().optional(),
  })),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(RMP_CACHE_LIFETIME, DEFAULT_CLIENT_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const { query, strict } = ctx.req.valid('query');

      // Query the RMP API
    let data = await rmp.search(query);
    
    // Augment the data we got with the search ranks
    let results: RMPRankedSearchResult[] = data.map(d => {
      /**
       * TODO: Is there a better way to do this?
       * We don't even use this score in the front-end
       * since `strict` searching is enabled by default.
       */
      let diceScore = diceCoefficient(query, `${d.firstName} ${d.lastName}`);

      return {
        ...d,
        _searchScore: diceScore,
      }
    });

    // Apply the "strict" option
    if (strict) {
      results = results.filter(item =>
        query.toLowerCase().includes(item.firstName.toLowerCase())
        && query.toLowerCase().includes(item.lastName.toLowerCase())
      )
    }

    // Sort the results
    results.sort((a,b) => b._searchScore - a._searchScore);

    return ctx.json(results);
  }
)

export default app

import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { describeRoute, resolver } from 'hono-openapi'
import { z } from 'zod'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Section } from '@cougargrades/models';
import { firestore } from '../lib/firestore-config'
import { DURATION_ZERO, NO_CACHE } from '../cache'

export const LATEST_TERM_CACHE_LIFETIME = Temporal.Duration.from({ days: 1 });

const app = new Hono()

app.get('/',
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(z.number().nullable()) }
        }
      }
    }
  }),
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: NO_CACHE ? undefined : TEMPORAL_CACHE_CONTROL(LATEST_TERM_CACHE_LIFETIME),
  }),
  async (ctx) => {
    const db = firestore();
    const snap = await db.collection('sections')
      .orderBy('term', 'desc')
      .limit(1)
      .get();
  
    if (snap.empty) return ctx.json(null);
    if (snap.docs.length === 0) return ctx.json(null);
    const data = snap.docs[0].data();
    const parsed = Section.pick({ term: true }).safeParse(data);
    if (!parsed.success) return ctx.json(null);
  
    return ctx.json(parsed.data.term);
  }
)

export default app
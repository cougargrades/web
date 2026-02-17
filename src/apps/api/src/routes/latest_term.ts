
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { Temporal } from 'temporal-polyfill'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Section } from '@cougargrades/models';
import { firestore } from '../lib/firestore-config'
import { DURATION_ZERO } from '../cache'

const app = new Hono()

app.get('/',
  cache({
    cacheName: 'cougargrades-api',
    cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
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
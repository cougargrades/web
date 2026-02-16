
import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { TEMPORAL_CACHE_CONTROL } from '@cougargrades/utils/cacheControl'
import { Temporal } from 'temporal-polyfill'
import { DEFAULT_CLIENT_CACHE_LIFETIME } from '../cache'
import { firestore } from '../lib/firestore-config'

//export const RMP_CACHE_LIFETIME: Temporal.Duration = Temporal.Duration.from({ days: 14 });

const db = firestore();

const app = new Hono()

app.get('/test',
  // zValidator('query', z.object({
  //   query: z.string().nonempty(),
  //   strict: z.coerce.boolean().optional(),
  // })),
  // cache({
  //   cacheName: 'cougargrades-api',
  //   cacheControl: TEMPORAL_CACHE_CONTROL(RMP_CACHE_LIFETIME, DEFAULT_CLIENT_CACHE_LIFETIME),
  // }),
  async (ctx) => {
    //const { query, strict } = ctx.req.valid('query');

    

    const snap = await db.collection('environment').limit(1).get();
    console.log('snap?', snap);

    return ctx.json(snap.docs.map(d => d.data()));
  }
)

export default app
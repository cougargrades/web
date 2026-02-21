
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { z } from 'zod'
import { firestore } from '../lib/firestore-config'

const app = new Hono()

app.get('/firestore',
  describeRoute({
    responses: {
      200: {
        description: '',
        content: {
          'application/json': { schema: resolver(z.record(z.string(), z.any())) }
        }
      }
    }
  }),
  // cache({
  //   cacheName: 'cougargrades-api',
  //   cacheControl: TEMPORAL_CACHE_CONTROL(DURATION_ZERO, Temporal.Duration.from({ days: 1 })),
  // }),
  async (ctx) => {
    const db = firestore();
    const snap = await db.collection('environment')
      .limit(1)
      .get();
  
    if (snap.empty) return ctx.json(null);
    if (snap.docs.length === 0) return ctx.json(null);
    const data = snap.docs[0].data();
    return ctx.json(data);
  }
)

export default app
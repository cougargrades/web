// books.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import * as simplesyllabus from '@cougargrades/vendor/simplesyllabus'

const app = new Hono()

app.get('/search',
  zValidator('query', z.object({
    query: z.string().nonempty(),
    strict: z.coerce.boolean().optional(),
  })),
  async (ctx) => {
    const { query, strict } = ctx.req.valid('query');

    let result = await simplesyllabus.search(query);
    if (strict === true && result?.sys.success === true && result.items) {
      result.items = result.items.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
    }

    //ctx.header('Cache-Control', 'TODO');
    return ctx.json(result);
  }
)

export default app
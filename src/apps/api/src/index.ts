import { Hono } from 'hono'

import rmp from './routes/rmp'
import simplesyllabus from './routes/simplesyllabus'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/rmp', rmp);
app.route('/api/simplesyllabus', simplesyllabus);

export default app

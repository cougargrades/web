import { Hono } from 'hono'
import { cors } from 'hono/cors'

import rmp from './routes/external/rmp'
import simplesyllabus from './routes/external/simplesyllabus'
import latest_term from './routes/latest_term'

const app = new Hono()

app.use('*', cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cougargrades.io",
    "https://next.cougargrades.io",
    "https://next2.cougargrades.io"
  ],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  maxAge: 600,
}));

app.get('/', (ctx) => {
  return ctx.text('Hello Hono!')
})

app.route('/api/external/rmp', rmp);
app.route('/api/external/simplesyllabus', simplesyllabus);
app.route('/api/latest_term', latest_term);

export default app

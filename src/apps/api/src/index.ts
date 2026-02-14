import { Hono } from 'hono'
import simplesyllabus from './routes/simplesyllabus'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/simplesyllabus', simplesyllabus);

export default app

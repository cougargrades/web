import { Hono } from 'hono'
import { cors } from 'hono/cors'

//console.log('google?', env.GOOGLE_APPLICATION_CREDENTIALS);

import rmp from './routes/rmp'
import simplesyllabus from './routes/simplesyllabus'
import firestore from './routes/firestore'

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

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/rmp', rmp);
app.route('/api/simplesyllabus', simplesyllabus);
app.route('/api/firestore', firestore);

export default app

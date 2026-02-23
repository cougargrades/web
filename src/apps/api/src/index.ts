import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { loadVendor, openAPIRouteHandler } from 'hono-openapi'
import { convertToOpenAPISchema } from "@standard-community/standard-openapi/convert"
import { swaggerUI } from '@hono/swagger-ui'
import { toJSONSchema } from 'zod/v4/core'

import rmp from './routes/external/rmp'
import simplesyllabus from './routes/external/simplesyllabus'
import environment from './routes/environment'
import latest_term from './routes/latest_term'
import top from './routes/top'
import trending from './routes/trending'
import course from './routes/course'
import instructor from './routes/instructor'
import group from './routes/group'
import popularity_contest from './routes/popularity_contest'

const app = new Hono()

app.use('*', cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",
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
app.route('/api/environment', environment);
app.route('/api/latest_term', latest_term);
app.route('/api/top', top);
app.route('/api/trending', trending);
app.route('/api/course', course);
app.route('/api/instructor', instructor);
app.route('/api/group', group);
app.route('/api/popularity_contest', popularity_contest);

// loadVendor('zod', {
//   toOpenAPISchema: (schema, context) => {
//     // TODO: fix why my Zod schemas aren't generating
//     const jsonSchema = toJSONSchema(schema as any, {
//       io: 'input',
//       //target: 'openapi-3.0',
//       unrepresentable: 'any',
//       cycles: 'ref',
//       reused: 'ref',
//     });
//     return convertToOpenAPISchema(jsonSchema as any, context);
//   }
// })

app.get('/openapi.json', openAPIRouteHandler(app, {
  documentation: {
    info: {
      title: 'CougarGrades API',
      version: '3.0.0',
    }
  },
  includeEmptyPaths: true,
}));
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

export default app

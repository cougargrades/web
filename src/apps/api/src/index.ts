import { Hono } from 'hono'
import { cors } from 'hono/cors'

//console.log('google?', env.GOOGLE_APPLICATION_CREDENTIALS);

import rmp from './routes/rmp'
import simplesyllabus from './routes/simplesyllabus'
import { firestore, PROJECT_ID } from './lib/firestore'

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

app.get('/firestore', async (c) => {
  const db = firestore();
  
  // //debugger; // /v1/{+parent}/databases
  // const foo = await db.projects.databases.list({ parent: `projects/${PROJECT_ID}` });
  // debugger;
  // //"projects/cougargrades-testing/databases/(default)"
  // const docs = await db.projects.databases.documents.list({ parent: `projects/cougargrades-testing/databases/(default)/documents`, collectionId: 'environment' });

  //const res = await db.projects.databases.documents.list({ collectionId: 'environment' });

  debugger;
  const foo = await db.collection('environment').listDocuments();
  console.log('documents?', foo.length);

  return c.json('hello');
})

export default app

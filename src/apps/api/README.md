
# @cougargrades/api

test 2

This is the HTTP API that powers 3rd party data in CougarGrades. Data that is provided by `@cougargrades/vendor` is accessible here through this API to abstract away, increase caching, and most importantly to fix CORS issues.

CougarGrade's own data is not served by this API, but by https://data.cougargrades.io

```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

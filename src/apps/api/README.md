
# @cougargrades/api

This is the HTTP API that powers all data in CougarGrades (both 1st and 3rd party). 

It is viewable at: https://api.cougargrades.io/

3rd party data that is provided by `@cougargrades/vendor` is accessible here in order to provide abstraction, increase caching, and to fix CORS issues.

It is deployed to [Cloudflare Workers](https://workers.cloudflare.com/).

It uses:
- [Hono 4](https://hono.dev/)
- [Zod 4](https://zod.dev/) for type safety and validation at runtime
- [Swagger UI via @hono/swagger-ui](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) for a viewable overview of the available endpoints
- [Cloudflare D1](https://developers.cloudflare.com/d1/) for tracking page views in SQLite, and making queries against it
- [Cloudflare Turnstile](https://www.cloudflare.com/application-services/products/turnstile/) as a non-interactive CAPTCHA solution for preventing abuse with page view tracking.


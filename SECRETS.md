## Secrets

```bash

# For uploading dev secrets
npx wrangler secret bulk --env "development" .dev.vars.development
# For uploading prod secrets
npx wrangler secret bulk --env "production" .dev.vars.production

```
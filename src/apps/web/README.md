
# @cougargrades/web

This is the <u>static</u> web app that users will actually use. It is deployed to [Cloudflare Pages](https://pages.cloudflare.com/).

It is viewable at: https://cougargrades.io/

It uses:
- React
- [Vite 8](https://vite.dev/guide/), which is Rust powered and very fast
- [TanStack Router](https://tanstack.com/router/latest) for routing
- [TanStack Query](https://tanstack.com/query/latest) for ANY data fetching, to ensure responsiveness and efficiency
- [Zod 4](https://zod.dev/) for type safety at runtime
- An combination of [Material UI](https://github.com/mui/material-ui) and heavily customized styles (with [new.css](https://github.com/xz/new.css) as a starting point).


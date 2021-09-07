# @cougargrades/web

[![Preview Environment](https://img.shields.io/github/deployments/cougargrades/web/Preview?label=Preview%20Environment)](https://next.cougargrades.io/)
[![Production Environment](https://img.shields.io/github/deployments/cougargrades/web/Production?label=Production%20Environment)](https://cougargrades.io)

React app that powers cougargrades.io

## Project Board

See: https://github.com/orgs/cougargrades/projects/2

## Project Status

| Project                  | Version | Status          | URL                            |
|--------------------------|---------|-----------------|--------------------------------|
| cougargrades.io (beta)   | 0.4.5   | Sunsetted 🌅    | N/A                            |
| cougargrades.io (1.X.X)  | 1.X.X   | Live 🚀         | https://cougargrades.io/       |
| cougargrades.io HTTP API | 2.0.0   | Live 🚀         | https://api.cougargrades.io    |

### Continuous Deployment

Active commits to the `next` branch (the default branch) are automatically deployed to [next.cougargrades.io](https://next.cougargrades.io/) for preview. When things are ready to move to production, a pull request will be made from `next` into the `master` branch, which will be automatically deployed to production. Commits **cannot** be made directly to `master`.

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


---

[![Powered by Vercel](public/powered-by-vercel.svg)](https://vercel.com/?utm_source=cougargrades&utm_campaign=oss)
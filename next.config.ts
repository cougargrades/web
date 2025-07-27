import type { NextConfig } from "next";
import { CACHE_CONTROL } from './lib/cache'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  transpilePackages: ['react-fitty'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  /**
   * See: https://nextjs.org/docs/app/api-reference/config/next-config-js/headers
   */
  headers: async function() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },                    
        ],
      },
      // We need our ISR/pre-rendered pages to be cached in Cloudflare, not just in the "Vercel ISR/pre-render cache"
      {
        source: '/c/:courseName',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_CONTROL
          }
        ]
      },
      // We need our ISR/pre-rendered pages to be cached in Cloudflare, not just in the "Vercel ISR/pre-render cache"
      {
        source: '/i/:instructorName',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_CONTROL
          }
        ]
      },
      // We need our ISR/pre-rendered pages to be cached in Cloudflare, not just in the "Vercel ISR/pre-render cache"
      {
        source: '/g/:groupId',
        headers: [
          {
            key: 'Cache-Control',
            value: CACHE_CONTROL
          }
        ]
      },
      /**
       * We also want to cache the `/_next/data/{hash}/{locale}/c/*.json` files that Next.js uses to hydrate the front-end.
       * Next.js claims that items with this URL are "truly immutable" and as a result we can't override ANY headers for these assets.
       * 
       * https://nextjs.org/docs/app/api-reference/config/next-config-js/headers#cache-control
       * 
       * Why would we need to? Next.js running locally gives them the Cache-Control of "public, max-age=31536000, immutable", but
       * Vercel overrides this to "public, max-age=0, must-revalidate" because they want to cache it server-side.
       * 
       * The problem is Vercel CHARGES FOR CACHED REQUESTS, so we can't cache "truly immutable" requests in a proxy or browser. 🙄
       * 
       * As a workaround, the following Cache Rules are put into place on the Cloudflare side:
       * 
       * - Cache `_next/data/{hash}/{locale}/c/*.json` for 7 days
       *  - Uri Path -> wildcard -> /_next/data/ * / * / c / *.json
       *  - Edge TTL -> 7 days
       * - Cache `_next/data/{hash}/{locale}/i/*.json` for 7 days
       *  - Uri Path -> wildcard -> /_next/data/ * / * / i / *.json
       *  - Edge TTL -> 7 days
       * - Cache `_next/data/{hash}/{locale}/g/*.json` for 7 days
       *  - Uri Path -> wildcard -> /_next/data/ * / * / g / *.json
       *  - Edge TTL -> 7 days
       * 
       */
    ]
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
    // Automatically redirect based on the user's preferred locale
    localeDetection: false,
  },
  // serverExternalPackages: [
  //   '@emotion/styled',
  //   '@emotion/react',
  //   '@emotion/cache',
  //   '@emotion/use-insertion-effect-with-fallbacks',
  //   '@emotion/utils'
  // ]
  // typescript: {
  //   // This old ass nextjs version won't typescript correctly... fuck it
  //   ignoreBuildErrors: true,
  // }
};

export default nextConfig;


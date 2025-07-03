const withTM = require('next-transpile-modules')(['fitty', 'react-fitty', 'react-tilty']);

/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
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
  typescript: {
    // This old ass nextjs version won't typescript correctly... fuck it
    ignoreBuildErrors: true,
  }
}
module.exports = withTM(config);

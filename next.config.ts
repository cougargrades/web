import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  transpilePackages: ['react-fitty'],
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
  serverExternalPackages: [
    '@emotion/styled',
    '@emotion/react',
    '@emotion/cache',
    '@emotion/use-insertion-effect-with-fallbacks',
    '@emotion/utils'
  ]
  // typescript: {
  //   // This old ass nextjs version won't typescript correctly... fuck it
  //   ignoreBuildErrors: true,
  // }
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();

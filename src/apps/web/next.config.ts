import type { NextConfig } from "next";
import { CACHE_CONTROL } from './lib/cache'

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  reactStrictMode: false,
  transpilePackages: ['react-fitty', '@mui/x-charts'],
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
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


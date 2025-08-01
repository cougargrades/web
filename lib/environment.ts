// Source: https://github.com/zeit/next.js/issues/1999#issuecomment-326805233

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
};

export type VercelEnv = 'production' | 'preview' | 'development';

const isNullish = (x: any) => x === null || x === undefined;
const isNullishOrWhitespace = (x: any) => isNullish(x) || (typeof(x) === 'string' && x.trim() === '');

export const buildArgs: {
  commitHash: string,
  version: string,
  buildDate: string,
  vercelEnv: VercelEnv
} = {
  commitHash: process.env.NEXT_PUBLIC_GIT_SHA ?? '',
  version: process.env.NEXT_PUBLIC_VERSION ?? '',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE ?? '',
  vercelEnv: isNullishOrWhitespace(process.env.NEXT_PUBLIC_VERCEL_ENV) ? 'development' : ((process.env.NEXT_PUBLIC_VERCEL_ENV as any) ?? 'development'),
};

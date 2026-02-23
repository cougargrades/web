
export const buildArgs: {
  commitHash: string,
  version: string,
  buildDate: string
} = {
  commitHash: import.meta.env?.VITE_PUBLIC_GIT_SHA ?? '',
  version: import.meta.env?.VITE_PUBLIC_VERSION ?? '',
  buildDate: import.meta.env?.VITE_PUBLIC_BUILD_DATE ?? '',
  //vercelEnv: isNullishOrWhitespace(process.env.NEXT_PUBLIC_VERCEL_ENV) ? 'development' : ((process.env.NEXT_PUBLIC_VERCEL_ENV as any) ?? 'development'),
};


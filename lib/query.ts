import { NextRouter } from 'next/router'

export const getQueryValue = (router: NextRouter, queryKey: string) => router.query[queryKey] || router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`));


import { useMemo } from 'react'
import { NextRouter, useRouter } from 'next/router'


// From: https://github.com/vercel/next.js/discussions/11484#discussioncomment-60563
export const getQueryValue = (router: NextRouter, queryKey: string) => router.query[queryKey] || router.asPath.match(new RegExp(`[&?]${queryKey}=(.*)(&|$)`));

// From: https://github.com/vercel/next.js/discussions/11484#discussioncomment-851571
export const useNextQueryParams = (): { [key: string]: string } => {
  const router = useRouter();
  const value = useMemo(() => {
    // @see https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const queryParamsStr = router.asPath
      .split("?")
      .slice(1)
      .join("");
    const urlSearchParams = new URLSearchParams(queryParamsStr);
    // the first key might be in the shape "/assets?foobar", we must change to "foobar"
    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }, [router.asPath]);

  return value;
};

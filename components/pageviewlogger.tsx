import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAnalyticsRef } from '../lib/hook'
import { buildArgs, firebaseConfig } from '../lib/environment'

/**
 * https://firebase.google.com/docs/app-check/web/recaptcha-provider?authuser=0
 */
export function PageViewLogger() {
  const analyticsRef = useAnalyticsRef()
  const router = useRouter()

  useEffect(() => {
    if(analyticsRef.current) {
      const analytics = analyticsRef.current
      console.log(`event logged: ${router.asPath}`);
      analytics.logEvent('page_view', {
        path_name: router.asPath,
      });
    }
  }, [router.asPath, analyticsRef]);

  return <></>;
}

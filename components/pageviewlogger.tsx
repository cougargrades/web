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
      analytics.logEvent('screen_view', {
        app_name: 'web',
        screen_name: router.asPath,
        app_id: firebaseConfig.appId,
        app_version: `${buildArgs.version} (${buildArgs.commitHash})`,
      });
    }
  }, [router.asPath, analyticsRef]);

  return <></>;
}

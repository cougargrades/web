import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { useFirebaseApp } from 'reactfire'

/**
 * https://firebase.google.com/docs/app-check/web/recaptcha-provider?authuser=0
 */
export function PageViewLogger() {
  const firebaseApp = useFirebaseApp()
  const router = useRouter()
  const analyticsRef = useRef(null)

  useEffect(() => {
    analyticsRef.current = firebaseApp.analytics()
  },[])

  useEffect(() => {
    const analytics = analyticsRef.current
    console.log(`event logged: ${router.asPath}`);
    analytics.logEvent('page-view', { path_name: router.asPath });
  }, [router.asPath, analyticsRef]);

  return <></>;
}

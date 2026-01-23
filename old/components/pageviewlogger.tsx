import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { AnalyticsProvider, FirebaseAppProvider, useAnalytics, useFirebaseApp } from 'reactfire'
import { getAnalytics, logEvent, isSupported, Analytics } from 'firebase/analytics'
//import { useAnalyticsRef } from '../lib/hook'
import { buildArgs, firebaseConfig } from '../lib/environment'
import { useAnalyticsRef } from '../lib/firebase'



// export function PageViewLogger() {
//   const app = useFirebaseApp()
//   const [wasSupported, setWasSupported] = useState(false)
  
//   useEffect(() => {
//     (async () => {
//       setWasSupported(await isSupported())
//     })();
//   }, [])

//   if (wasSupported) {
//     return (
//       <AnalyticsProvider sdk={getAnalytics(app)}>
//         <PageViewLoggerInner />
//       </AnalyticsProvider>
//     )
//   }

//   return <></>
// }

/**
 * https://firebase.google.com/docs/app-check/web/recaptcha-provider?authuser=0
 */
export function PageViewLogger() {
  //const analytics = useAnalytics()
  const analyticsRef = useAnalyticsRef()
  const router = useRouter()

  useEffect(() => {
    if(analyticsRef.current) {
      if(buildArgs.vercelEnv !== 'development') {
        const analytics = analyticsRef.current
        console.log(`event logged: ${router.asPath}`);
        logEvent(analytics, 'page_view', {
          page_path: router.asPath
        })
        // analytics.logEvent('page_view', {
        //   path_name: router.asPath,
        // });
      }
    }
  }, [router.asPath, analyticsRef]);

  return <></>;
}

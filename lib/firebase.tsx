import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
//const AppCheck = dynamic(() => import('../components/appcheck').then((mod) => mod.AppCheck))
import { AuthProvider, FirebaseAppProvider, FirestoreProvider, useFirebaseApp, useInitFirestore, useInitPerformance } from 'reactfire'
import { firebaseConfig } from './environment'

// import firebase from 'firebase/app'
// import 'firebase/performance'
// import 'firebase/analytics'
// import 'firebase/auth'
// import 'firebase/firestore'
// import 'firebase/app-check'

import { getAuth } from 'firebase/auth'
import { initializeFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore'

export const FirebaseAppProviderWrapper = (props: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirebaseComponents>
      {props.children}
    </FirebaseComponents>
  </FirebaseAppProvider>
);

function FirebaseComponents(props: { children: React.ReactNode }) {
  const firebaseApp = useFirebaseApp()
  const auth = getAuth();

  useInitPerformance(async (firebaseApp) => {
    const { getPerformance } = await import('firebase/performance')

    return getPerformance(firebaseApp)
  })

  return (
    <AuthProvider sdk={auth}>
      <Firestore>
        {props.children}
      </Firestore>
    </AuthProvider>
  );
}

function Firestore(props: { children: React.ReactNode }) {
  const { status, data: firestoreInstance } = useInitFirestore(async (firebaseApp) => {
    console.log('foo')
    const db = initializeFirestore(firebaseApp, {});
    try {
      await enableMultiTabIndexedDbPersistence(db);
    }
    catch(err) {
      console.warn('[firebase.tsx] There was an issue calling enableMultiTabIndexedDbPersistence. This is unfortunate, but safe to ignore. More:',err)
    }
    console.log('foo2')
    return db;
  });

  console.log(status)
  
  if(status === 'loading') {
    return <p>Loading...</p>
  }

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      {props.children}
    </FirestoreProvider>
  )
}

/**
 * https://firebase.google.com/docs/app-check/web/recaptcha-provider?authuser=0
 */
// export function AppCheck() {
//   const app = useFirebaseApp();
  
//   useEffect(() => {
//     if(buildArgs.vercelEnv === 'production' && firebaseConfig.recaptchaSiteKey !== undefined) {
//       const appCheck = app.appCheck();
//       appCheck.activate(firebaseConfig.recaptchaSiteKey)
//     }
//   },[])

//   return <></>;
// }

/* Not ready yet */

// export function PageViewLogger() {
//   const analytics = useAnalytics()
//   const router = useRouter()

//   useEffect(() => {
//     console.log(`event logged: ${router.asPath}`);
//     analytics.logEvent('page_view', {
//       path_name: router.asPath,
//     });
//   }, [router.asPath, analyticsRef]);

//   return null;
// }

// export function Analytics() {
//   const app = useFirebaseApp()
//   return (
//     <AnalyticsProvider>
//       <PageViewLogger />
//     </AnalyticsProvider>
//   )
// }

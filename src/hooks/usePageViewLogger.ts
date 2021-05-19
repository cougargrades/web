import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { preloadFirestore, useAnalytics, useFirebaseApp } from 'reactfire/dist/index';

// Useful for Google Analytics
// Inspired by: https://github.com/FirebaseExtended/reactfire/blob/9d96d92d212fbd616506848180e02e84d4866409/docs/use.md#log-page-views-to-google-analytics-for-firebase-with-react-router
export function usePageViewLogger() {
  const firebaseApp = useFirebaseApp();

  // Adapted from: https://github.com/FirebaseExtended/reactfire/blob/848eaa3c6993221c52d81c86c68700130a2d27f2/sample/src/App.js#L35-L78
  const preloadSDKs = (firebaseApp: firebase.default.app.App) => {
    return Promise.all([
      preloadFirestore({
        firebaseApp: firebaseApp,
        setup: firestore => {
          return firestore().settings({ ignoreUndefinedProperties: true });
        }
      })
    ])
  };
  preloadSDKs(firebaseApp);

  // our code begins here
  const analytics = useAnalytics();
  const location = useLocation();

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    console.log(`event logged: ${location.pathname}`);
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname, analytics]);
}

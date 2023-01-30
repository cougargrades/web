import React, { useEffect, useRef } from 'react'
import { FirebaseAppProvider, useFirebaseApp } from 'reactfire'
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics'
import { firebaseConfig } from './environment'

export function useAnalyticsRef() {
  const app = useFirebaseApp()
  const analyticsRef = useRef<Analytics>(null)

  useEffect(() => {
    (async () => {
      if(await isSupported()) {
        analyticsRef.current = getAnalytics(app)
      }
    })();
  }, [])

  return analyticsRef
}

export interface WrapperProps {
  children: React.ReactNode;
}

export const FirebaseAppProviderWrapper = (props: WrapperProps) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {props.children}
  </FirebaseAppProvider>
);


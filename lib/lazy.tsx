import React from 'react'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseConfig } from '../lib/environment'

export const FirebaseAppProviderWrapper = (props: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {props.children}
  </FirebaseAppProvider>
);


import React from 'react'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseConfig } from '../lib/environment'

import 'firebase/performance'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

export const FirebaseAppProviderWrapper = (props: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {props.children}
  </FirebaseAppProvider>
);

import React from 'react'
import { FirebaseAppProvider } from 'reactfire'
import { firebaseConfig } from '../lib/environment'

import firebase from 'firebase/app'
import 'firebase/performance'
import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/app-check'

export const FieldValue = firebase.firestore.FieldValue

export const FirebaseAppProviderWrapper = (props: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {props.children}
  </FirebaseAppProvider>
);

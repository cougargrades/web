import React, { useState, useEffect } from 'react'
import { FirebaseAppProvider, preloadFirestore, useFirebaseApp } from 'reactfire'
import { firebaseConfig } from './environment'
import * as localstorage from './localstorage'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/analytics'
//import 'firebase/firestore'
import 'firebase/app-check'
import { isOverNDaysOld } from './util'

export const FirebaseAppProviderWrapper = (props: { children: React.ReactNode }) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    <FirestorePreloader>
      {props.children}
    </FirestorePreloader>
  </FirebaseAppProvider>
);

export function FirestorePreloader(props: { children: React.ReactNode }) {
  const firebaseApp = useFirebaseApp()
  const [database, setDatabase] = useState<firebase.firestore.Firestore | undefined>(undefined)
  useEffect(() => {
    preloadFirestore({
      firebaseApp,
      setup: async firestore => {
        try {
          // set cache size to 300 megabytes
          firestore().settings({ cacheSizeBytes: 300e6 })
          
          // determine if cache is too old to keep around
          if(isOverNDaysOld(new Date(localstorage.get('cacheLastCleared')), 7)) {
            console.log('cache could potentially be out of date, clearing')
            await firestore().clearPersistence()
            localstorage.set('cacheLastCleared', new Date().toISOString())
          }
          else {
            console.log('cache is still fresh')
          }

          // enable cache
          await firestore().enablePersistence()
          console.log('[firebase.tsx] Persistence enabled')
        }
        catch(err) {
          console.warn('[firebase.tsx] There was an issue calling enablePersistence. This is unfortunate, but safe to ignore. More:',err)
        }
        setDatabase(firestore())
      }
    })
  }, [])

  if(!database) {
    return <p>Loading...</p>
  }

  return (
    <>{props.children}</>
  )
}

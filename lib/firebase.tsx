import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { FirebaseAppProvider, preloadFirestore, useFirebaseApp } from 'reactfire'
import { Firestore as FirestoreStub } from '@cougargrades/types/dist/FirestoreStubs'
import { firebaseConfig } from './environment'
import * as localstorage from './localstorage'
import { isOverNDaysOld } from './util'
import { isFirestoreLoadedAtom } from './recoil'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/performance'
import 'firebase/analytics'
//import 'firebase/firestore'
import 'firebase/app-check'

export interface WrapperProps {
  children: React.ReactNode;
}

export interface WrapperWithFallback extends WrapperProps {
  fallback?: React.ReactNode;
}

export const FirebaseAppProviderWrapper = (props: WrapperProps) => (
  <FirebaseAppProvider firebaseConfig={firebaseConfig}>
    {props.children}
  </FirebaseAppProvider>
);

export function FirestorePreloader() {
  const firebaseApp = useFirebaseApp()
  const [, setIsFirestoreLoaded] = useRecoilState<boolean>(isFirestoreLoadedAtom)
  useEffect(() => {
    preloadFirestore({
      firebaseApp,
      setup: async firestore => {
        try {
          // set cache size to 300 megabytes
          firestore().settings({ cacheSizeBytes: 300e6 })
          
          // determine if cache is too old to keep around (7 day age limit)
          if(isOverNDaysOld(new Date(localstorage.get('cacheLastCleared')), 7)) {
            console.debug('cache could potentially be out of date, clearing')
            await firestore().clearPersistence()
            localstorage.set('cacheLastCleared', new Date().toISOString())
          }
          else {
            console.debug('cache is still fresh')
          }

          // enable cache
          await firestore().enablePersistence()
          console.log('[firebase.tsx] Persistence enabled')
        }
        catch(err) {
          console.warn('[firebase.tsx] There was an issue calling enablePersistence. This is unfortunate, but safe to ignore. More:',err)
        }
        setIsFirestoreLoaded(true)
      }
    })
  }, [])

  return null;
}

export function FirestoreGuard(props: WrapperWithFallback) {
  const [isFirestoreLoaded, _] = useRecoilState<boolean>(isFirestoreLoadedAtom)

  return isFirestoreLoaded ? <>{props.children}</> : props.fallback ? <>{props.fallback}</> : null
}

export const firestoreStub: FirestoreStub = {
  // somehow this works
  doc: (x: any) => ({
    firestore: { app: { name: '[DEFAULT]' }}, onSnapshot: (x: any) => (() => undefined)
  }),
  // somehow this works
  collection: (x: any) => ({
    where: (a: any, b: any, c: any) => ({
      isEqual: () => false,
      onSnapshot: (x: any) => (() => undefined)
    }),
  }),
  runTransaction: (x: any) => undefined,
} as any

export function useFakeFirestore() {
  const app = useFirebaseApp()
  const [isFirestoreLoaded, _] = useRecoilState<boolean>(isFirestoreLoadedAtom)
  return isFirestoreLoaded ? app.firestore() : firestoreStub
}

import { atom } from 'recoil'
//import { Firestore as FirestoreStub } from '@cougargrades/types/dist/FirestoreStubs'
//import { firestoreStub } from './firebase'

export const searchInputAtom = atom<HTMLInputElement | null>({
  key: 'searchInputAtom',
  default: null,
})

export const jwtAtom = atom<firebase.default.auth.IdTokenResult | null>({
  key: 'jwtAtom',
  default: null,
})

export const tocAtom = atom<boolean>({
  key: 'tocAtom',
  default: false,
})

export const isFirestoreLoadedAtom = atom<boolean>({
  key: 'isFirestoreLoadedAtom',
  default: false,
})

// export const firestoreInstanceAtom = atom<firebase.default.firestore.Firestore | FirestoreStub>({
//   key: 'firestoreInstanceAtom',
//   default: firestoreStub,
// })

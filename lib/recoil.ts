import { atom } from 'recoil'

export const searchInputAtom = atom<HTMLInputElement | null>({
  key: 'searchInputAtom',
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

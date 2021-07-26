import React from 'react';
import { atom } from 'recoil'

export const searchInputAtom = atom<HTMLInputElement | null>({
  key: 'searchInputAtom',
  default: null
});

export const jwtAtom = atom<firebase.default.auth.IdTokenResult | null>({
  key: 'jwtAtom',
  default: null,
})

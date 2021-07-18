import React from 'react';
import { atom } from 'recoil'

export const searchInputAtom = atom<HTMLInputElement | null>({
  key: 'searchInputAtom',
  default: null
});

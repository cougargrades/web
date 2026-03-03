
import { atom, useAtom } from 'jotai';

export const searchInputAtom = atom<HTMLInputElement | null>(null)

export const tocAtom = atom<boolean>(false)

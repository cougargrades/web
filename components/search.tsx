import React, { useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import TextField from '@material-ui/core/TextField'
import { searchInputAtom } from '../lib/recoil'

export default function SearchBar() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [_, setSearchInput] = useRecoilState(searchInputAtom);
 
  /**
   * we're going to do something kinda strange, but we're going 
   * to use Recoil (tl;dr useState but across multiple components)
   * to save the ref of the <input> element across any component that wants it.
   * 
   * this is for the specific purpose of being able to focus the search bar from
   * any component we want to.
   */
  useEffect(() => {
    if(searchInputRef.current !== null) {
      setSearchInput(searchInputRef.current)
    }
  }, [searchInputRef])

  return (
    <TextField inputRef={searchInputRef} label="🔍 Search" type="search" variant="outlined" fullWidth />
  )
}
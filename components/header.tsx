import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { useRecoilState } from 'recoil'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
//import SearchIcon from '@material-ui/icons/Search'
import Dialog from '@material-ui/core/Dialog'
import Slide from '@material-ui/core/Slide'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import TextField from '@material-ui/core/TextField'
import CloseIcon from '@material-ui/icons/Close'
import { Emoji } from './emoji'
import { searchInputAtom } from '../lib/recoil'
import styles from './header.module.scss'
import { useEffect } from 'react'


export const NavLink = ({ href, children }) => <Link href={href} passHref><Button variant="contained" disableElevation>{children}</Button></Link>;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Header() {
  const [open, setOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [_, setSearchInput] = useRecoilState(searchInputAtom);
 
  // when ran, set the focus on the <input> dialog
  const focusSearchInput = () => {
    if(searchInputRef.current !== null) {
      searchInputRef.current.focus();
    }
  }

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
    <header className={styles.hero}>
      <div className="new-container">
        <hgroup>
          <h1>CougarGrades.io</h1>
          <h3>
            Analyze grade distribution data for any past University of Houston
            course
          </h3>
        </hgroup>
        <nav className={styles.nav}>
          <NavLink href="/"><Emoji label="home" symbol="🏠" />Home</NavLink>
          <NavLink href="/courses"><Emoji label="books" symbol="📚" />Courses</NavLink>
          <NavLink href="/instructors"><Emoji label="teacher" symbol="👩‍🏫" />Instructors</NavLink>
          <NavLink href="/groups"><Emoji label="file box" symbol="🗃️" />Groups</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
          <Button variant="contained" disabled disableElevation><Emoji label="fire" symbol="🔥" />Disabled</Button>
        </nav>
        <Container maxWidth="md">
          <TextField inputRef={searchInputRef} label="🔍 Search" type="search" variant="outlined" fullWidth />
        </Container>
      </div>
    </header>
  )
}
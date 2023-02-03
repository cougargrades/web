import React from 'react'
import Link from 'next/link'
import Button from '@mui/material/Button'
//import { useSigninCheck } from 'reactfire'
import Search, { SearchBarSkeleton } from './search'
import { Emoji } from './emoji'
import { LinkProps } from './link'

import styles from './header.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export const NavLink = ({ href, children }: LinkProps) => <Link href={href} passHref><Button variant="contained" disableElevation className={interactivity.hoverActive}>{children}</Button></Link>;

export default function Header() {
  //const { status, data: signInCheckResult } = useSigninCheck({ requiredClaims: { admin: true }});
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
          <NavLink href="/g/10"><Emoji label="card file box" symbol="🗃️" />Groups</NavLink>
          <NavLink href="/top"><Emoji label="fire" symbol="🔥" />Popular</NavLink>
          <NavLink href="https://blog.cougargrades.io"><Emoji label="megaphone" symbol="📣" />Updates</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
          <NavLink href="/faq"><Emoji label="speech bubble" symbol="💬" />FAQ</NavLink>
          {/* { status === 'success' && signInCheckResult.signedIn && signInCheckResult.hasRequiredClaims ? <>
            <NavLink href="/admin"><Emoji label="spy" symbol="🕵️" />Admin</NavLink>
            <NavLink href="/upload"><Emoji label="hammer and wrench" symbol="🛠️" />Upload</NavLink>
            <NavLink href="/utilities"><Emoji label="hammer and wrench" symbol="🛠️" />Utilities</NavLink>
          </> : <></>} */}
        </nav>
        <Search />
        {/* <FirestoreGuard fallback={<SearchBarSkeleton />}>
          <Search />
        </FirestoreGuard> */}
      </div>
    </header>
  )
}
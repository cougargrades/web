import Link from 'next/link'
import { useSigninCheck } from 'reactfire'
import Button from '@material-ui/core/Button'
import Search from './search'
import { Emoji } from './emoji'

import styles from './header.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export const NavLink = ({ href, children }) => <Link href={href} passHref><Button variant="contained" disableElevation className={interactivity.hoverActive}>{children}</Button></Link>;

export default function Header() {
  // include "as any" until: https://github.com/firebase/firebase-js-sdk/pull/5395 
  const { status, data: signInCheckResult } = useSigninCheck({ requiredClaims: { admin: true } as any });
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
          <NavLink href="https://blog.cougargrades.io"><Emoji label="megaphone" symbol="📣" />Updates</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
          { status === 'success' && signInCheckResult.signedIn && signInCheckResult.hasRequiredClaims ? <>
            <NavLink href="/admin"><Emoji label="spy" symbol="🕵️" />Admin</NavLink>
            <NavLink href="/upload"><Emoji label="hammer and wrench" symbol="🛠️" />Upload</NavLink>
            <NavLink href="/utilities"><Emoji label="hammer and wrench" symbol="🛠️" />Utilities</NavLink>
          </> : <></>}
        </nav>
        <Search />
      </div>
    </header>
  )
}
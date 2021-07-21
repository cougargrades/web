import Link from 'next/link'
import Button from '@material-ui/core/Button'
import Search from './search'
import Panko from './panko'
import { Emoji } from './emoji'

import styles from './header.module.scss'

export const NavLink = ({ href, children }) => <Link href={href} passHref><Button variant="contained" disableElevation>{children}</Button></Link>;

export default function Header() {
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
          <NavLink href="/groups"><Emoji label="card file box" symbol="🗃️" />Groups</NavLink>
          <NavLink href="https://blog.cougargrades.io"><Emoji label="newspaper" symbol="🗞️" />Updates</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
        </nav>
        <Search />
      </div>
    </header>
  )
}
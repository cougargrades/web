import Link from 'next/link'
import Button from '@material-ui/core/Button'
import { Emoji } from './emoji'
import styles from './header.module.scss'

export const NavLink = ({ href, children }) => <Link href={href} passHref><Button variant="contained" disableElevation>{children}</Button></Link>

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
          <NavLink href="/courses"><Emoji label="books" symbol="📚" />Courses</NavLink>
          <NavLink href="/instructors"><Emoji label="teacher" symbol="👩‍🏫" />Instructors</NavLink>
          <NavLink href="/groups"><Emoji label="file box" symbol="🗃️" />Groups</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
          <Button variant="contained" disabled disableElevation><Emoji label="fire" symbol="🔥" />Disabled</Button>
        </nav>
      </div>
    </header>
  )
}
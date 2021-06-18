import Link from 'next/link'
import Button from '@material-ui/core/Button'
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
          <NavLink href="/">🏠 Home</NavLink>
          <NavLink href="/courses">📚 Courses</NavLink>
          <NavLink href="/instructors">👩‍🏫 Instructors</NavLink>
          <NavLink href="/groups">🗃️ Groups</NavLink>
          <NavLink href="/about">👋 About</NavLink>
          <Button variant="contained" disabled disableElevation>🔥 Disabled</Button>
        </nav>
      </div>
    </header>
  )
}
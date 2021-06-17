import Link from 'next/link'
import { useRosetta } from '../lib/i18n'
import { Emoji } from './emoji'
import styles from './header.module.scss'
import navbubble from './navbubble.module.scss'

export default function Header() {
  const { t } = useRosetta();
  return (
    <header className={styles.hero}>
      <hgroup>
        <h1>{t('hello')} CougarGrades.io</h1>
        <h3>
          Analyze grade distribution data for any past University of Houston
          course
        </h3>
      </hgroup>
      <nav className={navbubble.nav}>
        <Link href="/">
          <a><Emoji label="home" symbol="🏠" /> Home</a>
        </Link>
        <Link href="/courses">
          <a><Emoji label="books" symbol="📚" /> Courses</a>
        </Link>
        <Link href="/instructors">
          <a><Emoji label="teacher" symbol="👩‍🏫" /> Instructors</a>
        </Link>
        <Link href="/groups">
          <a><Emoji label="card file box" symbol="🗃️" /> Groups</a>
        </Link>
        <Link href="/about">
          <a><Emoji label="waving hand" symbol="👋" /> About</a>
        </Link>
      </nav>
    </header>
  )
}
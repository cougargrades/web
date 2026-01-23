import React from 'react'
//import Search from './search'
import { Emoji } from './emoji'
import { DropdownNavLink, NavLink } from './link'
// import { NewFeatureWrap } from './NewFeatureWrap'

import styles from './header.module.scss'
import interactivity from '../styles/interactivity.module.scss'

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
          <NavLink href="/"><Emoji symbol="🏠" />Home</NavLink>
          <NavLink href="/g/10"><Emoji symbol="🗃️" />Groups</NavLink>
          <NavLink href="/top"><Emoji symbol="🔥" />Popular</NavLink>
          <NavLink href="/random"><Emoji symbol="🔀" />Random</NavLink>
          <NavLink href="https://blog.cougargrades.io"><Emoji label="megaphone" symbol="📣" />Updates</NavLink>
          <NavLink href="/about"><Emoji label="waving hand" symbol="👋" />About</NavLink>
          <NavLink href="/faq"><Emoji label="speech bubble" symbol="💬" />FAQ</NavLink>
        </nav>
        <span>search bar</span>
        {/* <Search /> */}
      </div>
    </header>
  )
}

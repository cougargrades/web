import Link from 'next/link'
import Button from '@material-ui/core/Button'
//import Icon from '@material-ui/core/Icon'
import { withStyles } from '@material-ui/core/styles'
//import { Emoji } from './emoji'
import styles from './header.module.scss'
import navbubble from './navbubble.module.scss'


export const NavBubble = withStyles(theme => ({
  root: {
    textDecoration: 'none' ,
    textTransform: 'none',
    padding: '0.25em 0.75em',
    paddingLeft: 'calc(0.75em + 4px)',
    borderRadius: '8px',
    fontWeight: 500,
    fontSize: 'inherit',
    lineHeight: 1.5,
    
    color: '#0070f3',
    backgroundColor: theme.palette.type === 'dark' ? '#2b2b2b' : '#e6ebf1',
    '&:active': {
      outline: 0,
    },
    '&:focus': {
      outline: 0,
      backgroundColor: theme.palette.type === 'dark' ? '##323232' : '#dfe6ed', 
    },
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? '#323232' : '#dfe6ed',
    },
  },
}))(Button);

export const NavBubbleLink = ({ href, children }) => <Link href={href} passHref><NavBubble>{children}</NavBubble></Link>

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
        <nav className={navbubble.nav}>
          <NavBubbleLink href="/">🏠 Home</NavBubbleLink>
          <NavBubbleLink href="/courses">📚 Courses</NavBubbleLink>
          <NavBubbleLink href="/instructors">👩‍🏫 Instructors</NavBubbleLink>
          <NavBubbleLink href="/groups">🗃️ Groups</NavBubbleLink>
          <NavBubbleLink href="/about">👋 About</NavBubbleLink>
        </nav>
      </div>
    </header>
  )
}
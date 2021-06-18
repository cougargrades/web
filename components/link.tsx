import Link from 'next/link'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import styles from './link.module.scss'

export const InternalLink = ({ href, children }) => <Link href={href} passHref><Button className={styles.linkbutton} color="primary" variant="contained">{children}</Button></Link>

export const ExternalLink = ({ href, children }) => <Link href={href} passHref><Button className={styles.linkbutton} color="primary" variant="contained" endIcon={<ArrowForwardIcon />}>{children}</Button></Link>

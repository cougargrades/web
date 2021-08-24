import React from 'react'
import Link, { LinkProps as NextLinkProps } from 'next/link'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import styles from './link.module.scss'
import interactivity from '../styles/interactivity.module.scss'


export const InternalLink = ({ href, children }) => <Link href={href} passHref><Button className={`${styles.linkbutton} ${interactivity.hoverActive}`} color="primary" variant="contained">{children}</Button></Link>

export const ExternalLink = ({ href, children }) => <Link href={href} passHref><Button className={`${styles.linkbutton} ${interactivity.hoverActive}`} color="primary" variant="contained" endIcon={<ArrowForwardIcon />}>{children}</Button></Link>

export const FakeLink = ({ href, children }) => {
  return <a href={href} onClick={e => e.preventDefault()} className="nostyle">{children}</a>
}
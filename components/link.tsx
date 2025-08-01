import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { useLongPress } from 'react-use'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import styles from './link.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export interface LinkProps {
  href: string;
  openInNewTab?: boolean;
  children: React.ReactNode;
}

export const InternalLink = ({ href, children }: LinkProps) => <Link href={href} passHref legacyBehavior><Button className={`${styles.linkbutton} ${interactivity.hoverActive}`} color="primary" variant="contained">{children}</Button></Link>

export const ExternalLink = ({ href, openInNewTab, children }: LinkProps) => (
  <Button
    className={`${styles.linkbutton} ${interactivity.hoverActive}`}
    color="primary"
    variant="contained"
    endIcon={<ArrowForwardIcon />}
    href={href}
    target={openInNewTab ? "_blank" : undefined}
    rel={openInNewTab ? "noreferrer" : undefined}
    >
    {children}
  </Button>
)

export const FakeLink = (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  const { href, children } = props
  return <a {...props} href={href} onClick={e => e.preventDefault()} className="nostyle">{children}</a>
}

export const NavLink = ({ href, children }: LinkProps) => <Link href={href} passHref legacyBehavior><Button variant="contained" disableElevation className={interactivity.hoverActive}>{children}</Button></Link>;

export interface DropdownNavLinkProps {
  href?: string;
  children: React.ReactNode;
  options: LinkProps[];
}

// Based off of: https://mui.com/material-ui/react-menu/#basic-menu
export function DropdownNavLink({ href, children, options }: DropdownNavLinkProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  };
  const longPressEvent = useLongPress(handleOpen);

  return (
  <>
    {
      href !== undefined
      ? <Link href={href} passHref legacyBehavior>
          <Button ref={buttonRef} title="Long-press to view more options" variant="contained" disableElevation className={interactivity.hoverActive} {...longPressEvent} data-has-contextmenu={true}>{children}</Button>
        </Link>
      : <Button ref={buttonRef} variant="contained" disableElevation className={interactivity.hoverActive} onClick={handleOpen}>{children}</Button>
    }
    <Menu
        anchorEl={buttonRef.current}
        open={open}
        onClose={handleClose}
      >
        { options.map(opt => (
          <Link key={opt.href} href={opt.href} passHref legacyBehavior>
            <a className={styles.linkUnstyled}>
              <MenuItem onClick={handleClose}>{opt.children}</MenuItem>
            </a>
          </Link>
        ))}
      </Menu>
  </>
  )
}
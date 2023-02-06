import React, { useState } from 'react'
import Link, { LinkProps as NextLinkProps } from 'next/link'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import styles from './link.module.scss'
import interactivity from '../styles/interactivity.module.scss'

export interface LinkProps {
  href: string;
  children: React.ReactNode;
}

export const InternalLink = ({ href, children }: LinkProps) => <Link href={href} passHref><Button className={`${styles.linkbutton} ${interactivity.hoverActive}`} color="primary" variant="contained">{children}</Button></Link>

export const ExternalLink = ({ href, children }: LinkProps) => <Link href={href} passHref><Button className={`${styles.linkbutton} ${interactivity.hoverActive}`} color="primary" variant="contained" endIcon={<ArrowForwardIcon />}>{children}</Button></Link>

export const FakeLink = ({ href, children }: LinkProps) => {
  return <a href={href} onClick={e => e.preventDefault()} className="nostyle">{children}</a>
}

export const NavLink = ({ href, children }: LinkProps) => <Link href={href} passHref><Button variant="contained" disableElevation className={interactivity.hoverActive}>{children}</Button></Link>;

export interface DropdownNavLinkProps {
  children: React.ReactNode;
  options: LinkProps[];
}

// Based off of: https://mui.com/material-ui/react-menu/#basic-menu
export function DropdownNavLink({ children, options }: DropdownNavLinkProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
  <>
    <Button variant="contained" disableElevation className={interactivity.hoverActive} onClick={handleClick}>{children}</Button>
    <Menu
        anchorEl={anchorEl}
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
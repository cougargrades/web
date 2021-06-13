import React from 'react';
import { NavLink } from 'react-router-dom';

import './TinyNav.scss';

/**
 * Tiny navigation bar for admin pages
 */
export function TinyNav(props: { title: string, links: { text: string, to: string }[] }) {
  const { title, links } = props;

  return (
    <>
    <h6>{title}</h6>
    <nav>
      {links.map(e =>
        <NavLink key={e.to} to={e.to}>
          {e.text}
        </NavLink>
      )}
    </nav>
    </>
  );
}

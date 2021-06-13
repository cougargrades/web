import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { usePageViewLogger } from '../../hooks/usePageViewLogger';

import { Emoji } from '~/components/ui/Emoji';

import './header.scss';

export function Header() {
  usePageViewLogger();
  const match = useRouteMatch();
  const isMini = [
    '/courses',
    '/instructors',
    '/c/:name',
    '/i/:fullName',
  ].includes(match.path);

  return (
    <header className={`hero ${isMini ? 'mini' : ''}`}>
      <hgroup>
        <h1>CougarGrades.io</h1>
        <h3>
          Analyze grade distribution data for any past University of Houston
          course
        </h3>
      </hgroup>
      <nav>
        <NavLink to="/" exact>
          <Emoji label="home" symbol="🏠" /> Home
        </NavLink>
        <NavLink to="/courses">
          <Emoji label="books" symbol="📚" /> Courses
        </NavLink>
        <NavLink to="/instructors">
          <Emoji label="teacher" symbol="👩‍🏫" /> Instructors
        </NavLink>
        <NavLink to="/groups">
          <Emoji label="card file box" symbol="🗃️" /> Groups
        </NavLink>
        <NavLink to="/about">
          <Emoji label="waving hand" symbol="👋" /> About
        </NavLink>
      </nav>
    </header>
  );
}

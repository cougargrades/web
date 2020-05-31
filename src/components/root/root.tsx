import React from 'react';
import { BrowserRouter, NavLink, Switch, Route } from 'react-router-dom';

import { Blurb } from './blurb';
import { Emoji } from '../emoji';
import { Homepage } from '../homepage/homepage';

import '@exampledev/new.css';
import '../../styles/base.scss';
import '../../styles/colors.scss';
import './header.scss';
import './footer.scss';

export const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <header className="hero">
        <hgroup>
          <h1>CougarGrades.io</h1>
          {/* <h3>Analyze grade distribution data</h3> */}
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
          <a href="#" className="disabled" title="Coming soon ™">
            <Emoji label="lock" symbol="🔒" /> Groups
          </a>
          <a href="https://github.com/cougargrades/web/wiki/Feedback">
            <Emoji label="speech balloon" symbol="💬" /> Feedback
          </a>
          <a href="https://cougargrades.github.io/blog/">
            <Emoji label="newspaper" symbol="🗞️" /> Updates
          </a>
          <NavLink to="/about">
            <Emoji label="waving hand" symbol="👋" /> About
          </NavLink>
        </nav>
      </header>
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/courses">
          <Blurb>
            <p>Courses page</p>
          </Blurb>
        </Route>
        <Route path="/c/:name">
          <Blurb>
            <p>Individual course page</p>
          </Blurb>
        </Route>
        <Route path="/instructors">
          <Blurb>
            <p>Instructors page</p>
          </Blurb>
        </Route>
        <Route path="/i/:fullName">
          <Blurb>
            <p>Individual instructors page</p>
          </Blurb>
        </Route>
        <Route path="/api" exact>
          <Blurb>
            <p>
              Did you mean to go to{' '}
              <code>
                <a href="/api/">/api/</a>
              </code>{' '}
              (with the trailing slash)?
            </p>
          </Blurb>
        </Route>
        <Route path="/about">
          <Blurb>
            <p>About page</p>
          </Blurb>
        </Route>
        <Route>
          <Blurb http404 />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
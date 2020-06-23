import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Blurb from './blurb';
import Header from '../header/header';
const Homepage = React.lazy(() => import('../homepage/homepage'));
const About = React.lazy(() => import('../about/about'));

import '../../styles/base.scss';
import '../../styles/colors.scss';

export default function Root() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" exact>
            <Header />
            <Homepage />
          </Route>
          <Route path="/courses">
            <Header />
            <Blurb>
              <p>Courses page</p>
            </Blurb>
          </Route>
          <Route path="/c/:name">
            <Header />
            <Blurb>
              <p>Individual course page</p>
            </Blurb>
          </Route>
          <Route path="/instructors">
            <Header />
            <Blurb>
              <p>Instructors page</p>
            </Blurb>
          </Route>
          <Route path="/i/:fullName">
            <Header />
            <Blurb>
              <p>Individual instructors page</p>
            </Blurb>
          </Route>
          <Route path="/api" exact>
            <Header />
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
            <Header />
            <About />
          </Route>
          <Route>
            <Header />
            <Blurb http404 />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

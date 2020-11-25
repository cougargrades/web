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
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
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
          <Route path="/groups">
            <Blurb>
              <p>Groups page</p>
            </Blurb>
          </Route>
          <Route path="/g/:groupName">
            <Blurb>
              <p>Individual groups page</p>
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
            <About />
          </Route>
          <Route>
            <Blurb http404 />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

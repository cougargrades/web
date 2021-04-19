import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { AuthCheck, useAnalytics } from 'reactfire/dist/index';

import Blurb from './blurb';
import Header from '../header/header';
const Homepage = React.lazy(() => import('../homepage/homepage'));
const About = React.lazy(() => import('../about/about'));
const AdminPanel = React.lazy(() => import('../adminpanel/adminpanel'));
const LoginForm = React.lazy(() => import('../adminpanel/loginform'));
const Uploader = React.lazy(() => import('../uploader/uploader'));

import '../../styles/base.scss';
import '../../styles/colors.scss';

// Useful for Google Analytics
// Inspired by: https://github.com/FirebaseExtended/reactfire/blob/9d96d92d212fbd616506848180e02e84d4866409/docs/use.md#log-page-views-to-google-analytics-for-firebase-with-react-router
function MyPageViewLogger() {
  const analytics = useAnalytics();
  const location = useLocation();

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    console.log(`event logged: ${location.pathname}`);
    analytics.logEvent('page-view', { path_name: location.pathname });
  }, [location.pathname]);

  return null;
}

export default function Root() {
  const analytics = useAnalytics();

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
          <Route exact path="/api">
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
          <Route exact path="/admin">
            <Redirect to="/admin/info"></Redirect>
          </Route>
          <Route path="/admin/info">
            <Suspense fallback={<div>Loading...</div>}>
              <AuthCheck fallback={<LoginForm />}>
                <LoginForm />
                <AdminPanel />
              </AuthCheck>
            </Suspense>
          </Route>
          <Route path="/admin/uploader">
            <Suspense fallback={<div>Loading...</div>}>
              <AuthCheck fallback={<LoginForm />}>
                <Uploader />
              </AuthCheck>
            </Suspense>
          </Route>
          <Route>
            <Blurb http404 />
          </Route>
        </Switch>
      </Suspense>
      <MyPageViewLogger />
    </BrowserRouter>
  );
}

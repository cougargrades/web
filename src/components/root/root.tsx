import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Switch, Route, useLocation, Redirect } from 'react-router-dom';
import { AuthCheck, preloadFirestore, useAnalytics, useFirebaseApp } from 'reactfire/dist/index';

import Blurb from './blurb';
import Header from '../header/header';
import ClaimsCheckWrap from '../adminpanel/CustomClaimsCheck';

import '../../styles/base.scss';
import '../../styles/colors.scss';
import TinyNav from '../adminpanel/tinynav';
const Homepage = React.lazy(() => import('../homepage/homepage'));
const About = React.lazy(() => import('../about/about'));
const AdminPanel = React.lazy(() => import('../adminpanel/adminpanel'));
const LoginForm = React.lazy(() => import('../adminpanel/loginform'));
const Uploader = React.lazy(() => import('../uploader/uploader'));

// Useful for Google Analytics
// Inspired by: https://github.com/FirebaseExtended/reactfire/blob/9d96d92d212fbd616506848180e02e84d4866409/docs/use.md#log-page-views-to-google-analytics-for-firebase-with-react-router
function MyPageViewLogger() {
  const firebaseApp = useFirebaseApp();

  // Adapted from: https://github.com/FirebaseExtended/reactfire/blob/848eaa3c6993221c52d81c86c68700130a2d27f2/sample/src/App.js#L35-L78
  const preloadSDKs = (firebaseApp: firebase.default.app.App) => {
    return Promise.all([
      preloadFirestore({
        firebaseApp: firebaseApp,
        setup: firestore => {
          return firestore().settings({ ignoreUndefinedProperties: true });
        }
      })
    ])
  };
  preloadSDKs(firebaseApp);

  // our code begins here
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
  const admin_title = 'Admin Navigation';
  const admin_links = [
    { text: 'User Info', to: '/admin/info'},
    { text: 'Database Uploader', to: '/admin/uploader'}
  ];

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
              <TinyNav title={admin_title} links={admin_links} />
              <AuthCheck fallback={<LoginForm />}>
                <LoginForm />
                <AdminPanel />
              </AuthCheck>
            </Suspense>
          </Route>
          <Route path="/admin/uploader">
            <Suspense fallback={<div>Loading...</div>}>
              <TinyNav title={admin_title} links={admin_links} />
              <AuthCheck fallback={<LoginForm />}>
                <ClaimsCheckWrap requiredClaims={{ admin: true }}>
                  <Uploader />
                </ClaimsCheckWrap>
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

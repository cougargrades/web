import React, { Suspense } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { AuthCheck } from 'reactfire/dist/index';

import { Blurb } from '~/components/ui/Blurb';
import { Header } from '~/components/header/header';
import { CustomClaimsCheck } from '~/components/auth/CustomClaimsCheck';
import { TinyNav } from '~/components/ui/TinyNav';

import '~/styles/base.scss';
import '~/styles/colors.scss';

const Homepage = React.lazy(() => import('~/routes/homepage/homepage'));
const About = React.lazy(() => import('~/routes/about/about'));
const AdminPanel = React.lazy(() => import('~/routes/adminpanel/adminpanel'));
const LoginForm = React.lazy(() => import('~/components/auth/LoginForm'));
const Uploader = React.lazy(() => import('~/routes/uploader/uploader'));

export default function Root() {
  const AdminNav = () => (
    <TinyNav title={'Admin Navigation'} links={[
      { text: 'User Info', to: '/admin/info'},
      { text: 'Database Uploader', to: '/admin/uploader'}
    ]} />
  );

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
              <AdminNav />
              <AuthCheck fallback={<LoginForm />}>
                <AdminPanel />
              </AuthCheck>
            </Suspense>
          </Route>
          <Route path="/admin/uploader">
            <Suspense fallback={<div>Loading...</div>}>
              <AdminNav />
              <AuthCheck fallback={<LoginForm />}>
                <CustomClaimsCheck requiredClaims={{ admin: true }}>
                  <Uploader />
                </CustomClaimsCheck>
              </AuthCheck>
            </Suspense>
          </Route>
          <Route>
            <Blurb http404 />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

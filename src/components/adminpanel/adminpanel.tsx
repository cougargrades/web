import type { User } from '@cougargrades/types';
import React, { Suspense } from 'react';
import { auth as fbAuth, AuthCheck, useAuth, useFirestore, useFirestoreDocData, useUser } from 'reactfire';

import { LoginForm } from './signin';

export function AdminPanel() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck fallback={<LoginForm />}>
        <LoginForm />
        <Dashboard />
      </AuthCheck>
    </Suspense>
  )
}

export function Dashboard() {
  // get the current user.
  // this is safe because we've wrapped this component in an `AuthCheck` component.
  const { data: user } = useUser();

  //console.log('uid?', user.uid)

  // read the user details from Firestore based on the current user's ID
  const userDetailsRef = useFirestore()
    .collection('users')
    .doc(user.uid);

  const { data, error } = useFirestoreDocData<User>(userDetailsRef);

  //console.log('Firestore data: ', data);
  //console.log('Firestore error: ', error);
  //console.log('User data: ', user);


  // typical SWR stuff
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <div>
      <table>
        <caption>Account Properties</caption>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>unlimited_access</td>
            <td>{`${data.unlimited_access}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
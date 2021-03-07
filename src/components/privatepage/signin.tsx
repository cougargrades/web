import React, { Suspense } from 'react';
import { auth as fbAuth, AuthCheck, useAuth, useFirestore, useFirestoreDocData, useUser } from 'reactfire';

interface Scientist {
  firstName: string;
  lastName: string;
}

// Inspired by: https://github.com/FirebaseExtended/reactfire/blob/9d96d92d212fbd616506848180e02e84d4866409/docs/use.md#combine-auth-firestore-and-cloud-storage-to-show-a-user-profile-card

export function PrivateChild() {
  const auth = useAuth();

  // get the current user.
  // this is safe because we've wrapped this component in an `AuthCheck` component.
  const { data: user } = useUser();

  // read the user details from Firestore based on the current user's ID
  const userDetailsRef = useFirestore()
    .collection('scientists')
    .doc('Curie, Marie');

  const { data, error } = useFirestoreDocData<Scientist>(userDetailsRef);

  const signOut = () => {
    auth.signOut();
  }

  console.log('Firestore data: ', data);
  console.log('Firestore error: ', error);

  console.log('User data: ', user);


  // typical SWR stuff
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;
  
  return (
    <div>
      <h1>Welcome back, {user.displayName}!</h1>
      <p>Have you ever heard of the scientist named {data.firstName} {data.lastName}?</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}

export function LoginForm() {
  const auth = useAuth();
  const provider = new fbAuth.GoogleAuthProvider();

  const signIn = () => {
    auth.signInWithPopup(provider)
  };

  return (
    <div>
      <h1>Authentication is required</h1>
      <button onClick={signIn}>Sign in</button>
    </div>
  );
}

export function PrivatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck fallback={<LoginForm />}>
        <PrivateChild />
      </AuthCheck>
    </Suspense>
  )
}
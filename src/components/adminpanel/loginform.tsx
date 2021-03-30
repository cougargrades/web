import React from 'react';
import { auth as fbAuth, useAuth } from 'reactfire';
import Collaborator from '../collaborator/collaborator';

export function LoginForm() {
  const auth = useAuth();
  const provider = new fbAuth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const signIn = () => {
    auth.signInWithPopup(provider)
  };

  const signOut = () => {
    auth.signOut();
  }

  // If already signed in, offer account options
  if (auth.currentUser) return (
    <div>
      <div>
        <h4>Signed in as:</h4>
        <Collaborator
          id={0}
          name={auth.currentUser.displayName!}
          login={auth.currentUser.email!}
          html_url="#"
          avatar_url={auth.currentUser.photoURL!}
        />
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  );

  // If not yet signed in, offer login options
  return (
    <div>
      <h4>Authentication required</h4>
      <p>Only authorized users will be permitted to access. Before proceeding, please sign in.</p>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}


import React from 'react';
import { auth as fbAuth, useAuth } from 'reactfire/dist/index';
import { Collaborator } from '~/components/ui/Collaborator';

import './UserAccountControl.scss';

export default function UserAccountControl() {
  const auth = useAuth();
  const provider = new fbAuth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const signOut = () => {
    auth.signOut();
  }

  const deleteAccount = async () => {
    if(auth.currentUser) {
      // this is a sensitive operation so we want to revalidate their identity
      const cred = await auth.currentUser.reauthenticateWithPopup(provider);
      // if reauthentication was successful
      if(cred.credential) {
        await auth.currentUser.delete();
      }
    }
  };

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
      <div className="button-spread">
        <button onClick={signOut}>Sign Out</button>
        <button onClick={deleteAccount} disabled={auth.currentUser === null}>Delete account</button>
      </div>
    </div>
  );

  // If not yet signed in, offer login options
  return (
    <div>
      <p>You're not signed in!</p>
    </div>
  );
}


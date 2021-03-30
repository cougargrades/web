import React from 'react';
import { auth as fbAuth, useAuth } from 'reactfire';
import Collaborator from '../collaborator/collaborator';

import './loginform.scss';

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
      <h4>Authentication required</h4>
      <p>Only authorized users will be permitted to access. Before proceeding, please sign in.</p>
      <p><small><em>By signing in, certain information about your Google account is <a href="https://github.com/cougargrades/api/blob/766cfd4c840712d59c2594dde19e2ecd4f3814b8/functions/src/firestore/saveUserToDatabase.ts#L16-L18">preserved in our database</a>. This is limited to: your display name, your email, and the URL of your Google account picture. Users will have the option of having their account <a href="https://github.com/cougargrades/api/blob/766cfd4c840712d59c2594dde19e2ecd4f3814b8/functions/src/firestore/deleteUserFromDatabase.ts#L4-L20">deleted from our database</a>. CougarGrades.io is open-source and not for profit. We are not interested in contacting you with this information or sharing it with third-parties.</em></small></p>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}


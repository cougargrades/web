import React from 'react';
import { auth as fbAuth, useAuth } from 'reactfire/dist/index';

import './LoginForm.scss';

export default function LoginForm() {
  const auth = useAuth();
  const provider = new fbAuth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const signIn = () => {
    auth.signInWithPopup(provider)
  };

  // If already signed in, offer account options
  if (auth.currentUser) return (
    <div>
      <p>You're already signed in!</p>
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


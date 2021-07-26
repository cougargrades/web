import React from 'react'
import { useAuth } from 'reactfire'

export function LoginForm() {
  const auth = useAuth();
  const fbAuth = useAuth;
  const provider = new fbAuth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  const signIn = async () => {
    await auth.signInWithPopup(provider)
  };

  // If already signed in, offer account options
  if (auth.currentUser) return (
    <div>
      <p>You&apos;re already signed in!</p>
    </div>
  );

  // If not yet signed in, offer login options
  return (
    <div>
      <h4>Authentication required</h4>
      <p>Only authorized users will be permitted to access. Before proceeding, please sign in.</p>
      <details>
        <summary>
          <small>
            By signing in, certain information about your Google account is preserved in our database. What does this mean?
          </small>
        </summary>
        <p>
          <small>
            This is limited to: <a href="https://github.com/cougargrades/api/blob/766cfd4c840712d59c2594dde19e2ecd4f3814b8/functions/src/firestore/saveUserToDatabase.ts#L16-L18">your display name, your email, and the URL of your Google account picture</a>.
            Users will have the option of having their account <a href="https://github.com/cougargrades/api/blob/766cfd4c840712d59c2594dde19e2ecd4f3814b8/functions/src/firestore/deleteUserFromDatabase.ts#L4-L20">deleted from our database</a>.
            CougarGrades.io is open-source and not for profit. We are not interested in contacting you with this information or sharing it with third-parties.
          </small>
        </p>
      </details>
      <button onClick={signIn}>Sign in with Google</button>
    </div>
  );
}

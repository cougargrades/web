import React from 'react'
import { auth as fbAuth, useAuth, useUser, useIdTokenResult } from 'reactfire'
import { CustomClaimNames as isCustomClaim } from '@cougargrades/types/dist/is'
import { Collaborator } from '../collaborator'

import styles from './UserAccountControl.module.scss'

interface UserAccountControlProps {
  forceRefresh?: boolean;
}

export function UserAccountControl({ forceRefresh }: UserAccountControlProps) {
  // get the current user, identified by the SDK-managed JWT 
  const { data: user } = useUser();
  const { data: jwt, error } = useIdTokenResult(user, forceRefresh);

  // for signing out
  const auth = useAuth();
  const provider = new fbAuth.GoogleAuthProvider();
  provider.addScope('profile');
  provider.addScope('email');

  // typical SWR stuff
  if (error) return <div>failed to load</div>;
  if (!jwt) return <div>loading...</div>;

  // for rendering claims
  const rows = Object.keys(jwt.claims)
  // dont present other stuff present in the OpenID spec
  // see: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
  .filter(e => isCustomClaim(e))
  .map(key => 
    <tr key={key}>
      <td>{key}</td>
      <td>{JSON.stringify(jwt.claims[key])}</td>
    </tr>
  );

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
      <div className={styles.buttonSpread}>
        <button onClick={signOut}>Sign Out</button>
        <button onClick={deleteAccount} disabled={auth.currentUser === null}>Delete account</button>
      </div>
      <table>
        <caption>Custom Claims</caption>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );

  // If not yet signed in, offer login options
  return (
    <div>
      <p>You&apos;re not signed in!</p>
    </div>
  );
}

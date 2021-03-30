import { CustomClaims } from '@cougargrades/types';
import React from 'react';
import { useFirestore, useFirestoreDocData, useUser, useAuth, useIdTokenResult } from 'reactfire';

export function Dashboard() {
  // get the current user.
  // this is safe because we've wrapped this component in an `AuthCheck` component.
  const { data: user } = useUser();
  const { data: jwt, error } = useIdTokenResult(user, true);
  const custom_claims = ['admin'];

  //console.log('uid?', user.uid)

  // read the user details from Firestore based on the current user's ID
  // const userDetailsRef = useFirestore()
  //   .collection('users')
  //   .doc(user.uid);

  //const { data, error } = useFirestoreDocData<User>(userDetailsRef);

  //console.log('Firestore data: ', data);
  //console.log('Firestore error: ', error);
  //console.log('User data: ', user);


  // typical SWR stuff
  if (error) return <div>failed to load</div>;
  if (!jwt) return <div>loading...</div>;

  const rows = Object.keys(jwt.claims)
  .filter(e => custom_claims.includes(e))
  .map(key => 
    <tr key={key}>
      <td>{key}</td>
      <td>{JSON.stringify(jwt.claims[key])}</td>
    </tr>
  );

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
          {rows}
        </tbody>
      </table>
    </div>
  );
}
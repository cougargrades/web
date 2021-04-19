import React from 'react';
import { useUser, useIdTokenResult } from 'reactfire/dist/index';

export default function AdminPanel() {
  // get the current user, identified by the SDK-managed JWT 
  const { data: user } = useUser();
  const { data: jwt, error } = useIdTokenResult(user, true);
  // dont present other stuff present in the OpenID spec
  // see: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
  const custom_claims = ['admin'];
  
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
}
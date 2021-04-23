import React from 'react';
import { ClaimsCheck, useIdTokenResult, useUser } from 'reactfire/dist/index';
import Emoji from '../emoji';

/**
 * Re-implementation of: https://github.com/FirebaseExtended/reactfire/blob/b4f22bc0a84729245db87861d5190a0483b19348/src/auth.tsx#L74-L95
 */
export default function CustomClaimsCheck(props: { requiredClaims: { [key: string]: any; }, children: React.ReactNode, fallback?: React.ReactNode}) {
  const { status, data: user} = useUser();
  const { data: jwt, error } = useIdTokenResult(user, true);
  const { requiredClaims, children } = props;
  
  // typical SWR stuff
  if (error) return <div>oops</div>;
  if (!jwt) return <div>nope</div>;

  let missingClaims: { [key: string]: { expected: string, actual: string}; } = {};

  for(let claim of Object.keys(requiredClaims)) {
    if (requiredClaims[claim] !== jwt.claims[claim]) {
      missingClaims[claim] = {
        expected: requiredClaims[claim],
        actual: jwt.claims[claim]
      };
    }
  }

  if (Object.keys(missingClaims).length === 0) {
    return <>{children}</>;
  } 
  else if(props.fallback) {
    return <>{props.fallback}</>;
  }
  else {
    // if no fallback is provided, show the actual missing claims
    return (
      <>
      <h2><Emoji symbol="🚫" label="prohibited" style={{ marginRight: '0.5rem' }} />Unauthorized</h2>
      <p>You are missing these claims to gain access:</p>
      <ul>
        {Object.keys(missingClaims).map(e => 
          <li key={e}>
            {e}
            <ul>
              <li>expected: <code>{`${missingClaims[e].expected}`}</code></li>
              <li>actual: <code>{`${missingClaims[e].actual}`}</code></li>
            </ul>
          </li>
        )}
      </ul>
      </>
    );
  }
}


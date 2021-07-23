import React from 'react'
import { useIdTokenResult, useUser } from 'reactfire'
import { Emoji } from '../emoji'

interface CustomClaimsCheckProps {
  requiredClaims: { [key: string]: any; };
  children: React.ReactNode;
  fallback?: React.ReactNode;
  forceRefresh?: boolean;
}

/**
 * Re-implementation of: https://github.com/FirebaseExtended/reactfire/blob/b4f22bc0a84729245db87861d5190a0483b19348/src/auth.tsx#L74-L95
 */
export function CustomClaimsCheck({ requiredClaims, children, fallback, forceRefresh }: CustomClaimsCheckProps) {
  const { data: user} = useUser();
  const { data: jwt, error } = useIdTokenResult(user, forceRefresh);
  
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
  else if(fallback) {
    return <>{fallback}</>;
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

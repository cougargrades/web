import React from 'react'
import { useSigninCheck } from 'reactfire'
import { useJWT } from './RealtimeClaimUpdater'
import { Emoji } from '../emoji'

interface CustomClaimsCheckProps {
  requiredClaims: { [key: string]: any; };
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Re-implementation of: https://github.com/FirebaseExtended/reactfire/blob/b4f22bc0a84729245db87861d5190a0483b19348/src/auth.tsx#L74-L95
 */
export function CustomClaimsCheck({ requiredClaims, children, fallback }: CustomClaimsCheckProps) {
  const { status, data } = useSigninCheck({ requiredClaims });
  const jwt = useJWT()
  
  // typical SWR stuff
  if (status === 'error') return <div>Error</div>;
  if (status === 'loading') return <div>Loading</div>;

  // if we're signed in and have a token to reference
  if(data.signedIn && jwt) {
    let missingClaims: { [key: string]: { expected: string, actual: string}; } = {};

    for(let claim of Object.keys(requiredClaims)) {
      if (requiredClaims[claim] !== jwt.claims[claim]) {
        missingClaims[claim] = {
          expected: requiredClaims[claim],
          actual: jwt.claims[claim]
        };
      }
    }

    // if the user is unauthorized
    if(Object.keys(missingClaims).length > 0) {
      if(fallback) {
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
    else {
      // if they're authorized, show the intended content
      return <>{children}</>;
    }
  }
  else {
    return (
      <>
      <h2><Emoji symbol="🚫" label="prohibited" style={{ marginRight: '0.5rem' }} />Unauthorized</h2>
      <p>You are not signed in!</p>
      </>
    );
  }  
}

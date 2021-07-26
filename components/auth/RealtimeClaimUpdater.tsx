import { User } from '@cougargrades/types'
import { useEffect, useState } from 'react';
import { useFirestore, useFirestoreDoc, useSigninCheck } from 'reactfire'
import { useRecoilState } from 'recoil'

import { jwtAtom } from '../../lib/recoil'

export function useJWT() {
  const [jwt, _] = useRecoilState(jwtAtom);
  return jwt;
}

/**
 * Insert this somewhere in your DOM tree. It will always just render 1 empty React.Fragment.
 * @returns 
 */
export function RealtimeClaimUpdater() {
  const { status, data: signInCheckResult } = useSigninCheck();
  const shouldSubscribe = status === 'success' && signInCheckResult.signedIn
  const [jwt, setJwt] = useRecoilState(jwtAtom);

  //console.log('shouldSubscribe?', shouldSubscribe)

  useEffect(() => {
    // this removes outdated JWTs if the user unsubscribes
    if(! shouldSubscribe) {
      //console.log('jwt nullified')
      setJwt(null)
    }
  }, [shouldSubscribe, jwt])

  return shouldSubscribe ? <UserDocumentSubscriber delay={5000} user={signInCheckResult.user} /> :  <></>;
}

interface UserDocumentSubscriberProps {
  user: firebase.default.User;
  delay: number;
}

/**
 * This should only be called if the user is already signed in
 * We use a separate component instead of 1 hook because hooks can't be 
 * conditionally called, but components can.
 */
function UserDocumentSubscriber({ user, delay }: UserDocumentSubscriberProps) {
  const db = useFirestore();
  const [forceRefresh, setForceRefresh] = useState(false);
  const [jwt, setJwt] = useRecoilState(jwtAtom);
  const { status: docStatus, data: doc } = useFirestoreDoc<User>(db.doc(`/users/${user.uid}`))

  // initialize jwt
  useEffect(() => {
    (async () => {
      if(jwt === null) {
        setJwt(await user.getIdTokenResult());
        //console.log('jwt initialized')
      }
    })();
  }, [jwt])

  // trigger a token refresh using a brief state change
  useEffect(() => {
    (async () => {
      if(forceRefresh) {
        //console.log('forceRefresh tripped')
        setJwt(await user.getIdTokenResult(true));
        setTimeout(() => setForceRefresh(false), delay)
      }
    })();
    //console.log('refresh effect')
  }, [forceRefresh])

  // compare changes
  useEffect(() => {
    // don't try another refresh until the effect hook above catches up
    if(! forceRefresh) {
      // verify that both are loaded before comparing
      if(docStatus === 'success' && doc.exists && jwt !== null) {
        const docData = doc.data()
        //console.log('JWT (doc): ', docData.custom_claims)
        //console.log('JWT (recoil): ', onlyClaims(jwt.claims, ['admin','hello']));
        // compare if token claims are different from the doc
        for(const key of Object.keys(docData.custom_claims)) {
          if(docData.custom_claims[key] !== jwt.claims[key]) {
            //console.log('discrepancy!',docData.custom_claims[key],' vs ',jwt.claims[key])
            setForceRefresh(true);
            break;
          }
        }
        //console.log('comparator done')
      }
    }
  }, [forceRefresh, docStatus, doc, jwt])

  return <></>
}


const onlyClaims = (raw: { [key: string]: any }, allowed: string[]) => Object.keys(raw)
  .filter(e => allowed.includes(e))
  .reduce((obj, key) => {
    obj[key] = raw[key];
    return obj;
  }, {});


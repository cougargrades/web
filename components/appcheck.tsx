import { useEffect } from 'react'
import { useFirebaseApp } from 'reactfire'
import { buildArgs, firebaseConfig } from '../lib/environment'

/**
 * https://firebase.google.com/docs/app-check/web/recaptcha-provider?authuser=0
 */
export function AppCheck() {
  const app = useFirebaseApp();
  
  useEffect(() => {
    if(buildArgs.vercelEnv === 'production' && firebaseConfig.recaptchaSiteKey !== undefined) {
      const appCheck = app.appCheck();
      appCheck.activate(firebaseConfig.recaptchaSiteKey)
    }
  },[])

  return <></>;
}

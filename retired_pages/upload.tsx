import React from 'react'
import { useSigninCheck } from 'reactfire'
import { CustomClaimsCheck } from '../components/auth/CustomClaimsCheck'
import { LoginForm } from '../components/auth/LoginForm'
import { Uploader } from '../components/uploader/uploader'

export default function Upload() {
  const { status, data: signInCheckResult } = useSigninCheck();
  return (
    <div className="new-container">
      { status === 'success' && signInCheckResult.signedIn ? <>
        <CustomClaimsCheck requiredClaims={{ admin: true }}>
          <Uploader />
        </CustomClaimsCheck>
      </> : <LoginForm />}
    </div>
  );
}

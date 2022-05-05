import React from 'react'
import { useSigninCheck } from 'reactfire'
import { CustomClaimsCheck } from '../components/auth/CustomClaimsCheck'
import { LoginForm } from '../components/auth/LoginForm'
import { QueueManager } from '../components/uploader/queuemanager'

export default function Queue() {
  const { status, data: signInCheckResult } = useSigninCheck();
  return (
    <div className="new-container">
      { status === 'success' && signInCheckResult.signedIn ? <>
        <CustomClaimsCheck requiredClaims={{ admin: true }}>
          <QueueManager />
        </CustomClaimsCheck>
      </> : <LoginForm />}
    </div>
  );
}

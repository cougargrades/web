import React from 'react'
import { useSigninCheck } from 'reactfire'
import { UserAccountControl } from '../components/auth/UserAccountControl'
import { LoginForm } from '../components/auth/LoginForm'

export default function AdminPanel() {
  const { status, data: signInCheckResult } = useSigninCheck();
  return (
    <div className="new-container">
      { status === 'success' && signInCheckResult.signedIn ? <>
        <UserAccountControl />
      </> : <LoginForm />}
    </div>
  );
}

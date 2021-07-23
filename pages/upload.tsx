import React from 'react'
import { AuthCheck } from 'reactfire'
import { CustomClaimsCheck } from '../components/auth/CustomClaimsCheck'
import { LoginForm } from '../components/auth/LoginForm'
import Uploader from '../components/uploader'

export default function Upload() {
  return (
    <div className="new-container">
      <AuthCheck fallback={<LoginForm />}>
        <CustomClaimsCheck requiredClaims={{ admin: true }} forceRefresh>
          <Uploader />
        </CustomClaimsCheck>
      </AuthCheck>
    </div>
  );
}

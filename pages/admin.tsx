import React from 'react'
import { AuthCheck } from 'reactfire'
import { UserAccountControl } from '../components/auth/UserAccountControl'
import { LoginForm } from '../components/auth/LoginForm'

export default function AdminPanel() {
  return (
    <div className="new-container">
      <AuthCheck fallback={<LoginForm />}>
        <UserAccountControl forceRefresh />
      </AuthCheck>
    </div>
  );
}

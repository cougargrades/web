import React, { Suspense } from 'react';
import { AuthCheck } from 'reactfire';

import { LoginForm } from './loginform';
import { Dashboard } from './dashboard';

export default function AdminPanel() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthCheck fallback={<LoginForm />}>
        <LoginForm />
        <Dashboard />
      </AuthCheck>
    </Suspense>
  )
}

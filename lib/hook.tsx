import { useEffect, useRef } from 'react'
import { useMedia } from 'react-use'
import { useRouter } from 'next/router'
import { useFirebaseApp } from 'reactfire'

export function useIsMobile() {
  return useMedia('(max-width: 576px)');
}

export function useIsCondensed() {
  return useMedia('(max-width: 768px)');
}

export function useAnalyticsRef() {
  const firebaseApp = useFirebaseApp()
  const router = useRouter()
  const analyticsRef = useRef<firebase.default.analytics.Analytics>(null)

  useEffect(() => {
    analyticsRef.current = firebaseApp.analytics()
  },[])

  return analyticsRef;
}

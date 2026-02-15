import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useLocalStorage, useSessionStorage } from 'react-use'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'

import styles from './NewFeatureWrap.module.scss'

export interface NewFeatureWrapProps {
  featureID?: string;
  showUntil?: Date;
  hideOnceVisitHref?: string;
  hideAfterClick?: boolean;
  children: React.ReactNode;
}

const FEATURE_PREFIX = 'io.cougargrades.feature_ack'

export function NewFeatureWrap({ featureID, showUntil, hideOnceVisitHref, hideAfterClick, children }: NewFeatureWrapProps) {
  const router = useRouter();
  const [visiblePersistent, setVisiblePersistent] = useLocalStorage<boolean>(`${FEATURE_PREFIX}.${featureID}`, true)
  const [visible, setVisible] = useState(true)

  // Once on first render
  useEffect(() => {
    // If featureID is defined, load our persistent state for this feature
    if (featureID !== undefined) {
      setVisible(!!visiblePersistent)
    }
  },[])

  // changes to the persistent should affect the local
  useEffect(() => {
    if (featureID !== undefined) {
      setVisible(!!visiblePersistent)
    }
  }, [visiblePersistent])

  const handleClick = () => {
    if (featureID && hideAfterClick) {
      setVisiblePersistent(false)
    }
  }

  // Check after every re-route
  useEffect(() => {
    // If showUntil specified, show based off of that
    if (showUntil !== undefined) {
      // if showUntil is before today
      if (showUntil < new Date()) {
        setVisible(false)
      }
    }
    else if(featureID !== undefined) {
      if (hideOnceVisitHref !== undefined) {
        if (router.asPath === hideOnceVisitHref) {
          setVisiblePersistent(false)
        }
      }
    }
  }, [router])

  const badgeContent = (<>
    <span className={styles.newBadge}>new</span>
  </>)

  return (
    <Badge color="primary" badgeContent={badgeContent} showZero variant="standard" invisible={!visible} onClick={handleClick}>
      {children}
    </Badge>
  )
}

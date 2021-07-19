import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import IosShareIcon from '@material-ui/icons/IosShare'
import { copyText } from '../lib/clipboard'
import { Emoji } from './emoji'
import styles from './panko.module.scss'

const strip = (path: string) => path.split(/[?|#]/).slice(0,1).join('')

export default function Panko() {
  const router = useRouter();

  return (
    <Breadcrumbs  aria-label="breadcrumb">
      {generateBreadcrumbs(strip(router.asPath))}
    </Breadcrumbs>
  )
}

export function PankoRow() {
  const [open, setOpen] = useState(false);

  const handleShare = async () => {
    const isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0;
    if(navigator.share && ! isMac) {
      // Web Share API is supported
      navigator.share({
        title: document.title,
        url: window.location.href
      })
      .then(() => {})
      .catch(() => {})
    }
    else {
      // Fallback
      await copyText(window.location.href);
      setOpen(true);
    }
  }

  return (
    <div className={`new-container ${styles.pankoRow}`}>
      <Panko />
      <div>
        <IconButton color="primary" aria-label="Share" onClick={handleShare}>
          <IosShareIcon />
        </IconButton>
        <Snackbar
          open={open}
          autoHideDuration={10*6000}
          onClose={() => setOpen(false)}
          message="✓ Copied link"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          action={<>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          </>}
        />
      </div>
    </div>
  )
}

export function generateBreadcrumbs(path: string) {
  return path.split('/').map((value, index, array) => {
    const key = `${index}|${value}`
    if(index === 0) {
      return <span key={key}>Home</span>
    }
    if(index === 1) {
      if(value.toLowerCase() === 'c') {
        return <span key={key}><Emoji label="books" symbol="📚" />Courses</span>
      }
      if(value.toLowerCase() === 'i') {
        return <span key={key}><Emoji label="teacher" symbol="👩‍🏫" />Instructors</span>
      }
      if(value.toLowerCase() === 'g') {
        return <span key={key}><Emoji label="file box" symbol="🗃️" />Groups</span>
      }
    }
    if(index === 2) {
      if(array[1].toLowerCase() === 'g') {
        return <span key={key}>Group ID #{decodeURI(value)}</span>
      }
    }
    return <span key={key}>{decodeURI(value)}</span>
  })
}

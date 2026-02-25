import React, { useState, useEffect } from 'react'
import { useLocation, useRouter } from '@tanstack/react-router'
import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import Tooltip from '@mui/material/Tooltip'
import { copyText } from '../lib/clipboard'
import { Emoji } from './emoji'
import { BlogNotifications } from './blog'
import { POPULAR_TABS } from '../lib/top'

import styles from './panko.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { useIsMobile } from '../lib/mediaQueries'

const strip = (path: string) => path.split(/[?|#]/).slice(0,1).join('')

export default function Panko() {
  //const router = useRouter();
  const location = useLocation();

  return (
    <Breadcrumbs  aria-label="breadcrumb">
      {generateBreadcrumbs(strip(location.pathname))}
    </Breadcrumbs>
  )
}

export function PankoRow() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile()
  const [tooltipText, setTooltipText] = useState('Copy Link')
  const [toasterMessage, setToasterMessage] = useState('✓ Copied link')

  const handleShare = async () => {
    const isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0;
    const shouldShare = ! isMac
    if(navigator.share && shouldShare) {
      // Web Share API is supported
      navigator.share({
        title: document.title,
        url: window.location.href
      })
      .then(() => {
        setToasterMessage('✓ Link shared')
        setOpen(true)
      })
      .catch(() => {})
    }
    else {
      // Fallback
      await copyText(window.location.href);
      setToasterMessage('✓ Copied link')
      setOpen(true);
    }
  }

  useEffect(() => {
    if('share' in navigator) {
      const inUserAgent = (x: string) => navigator.userAgent.toLowerCase().indexOf(x.toLocaleLowerCase()) >= 0
      
      const isMac = inUserAgent('Macintosh');
      // official name: https://support.apple.com/guide/mac-help/use-the-share-menu-on-mac-mh40614/mac
      //if(isMac) setTooltipText('Open macOS Share Menu')
      
      const isWin10 = inUserAgent('Windows NT');
      // official name: https://blogs.windows.com/windowsdeveloper/2017/04/06/new-share-experience-windows-10-creators-update/
      if(isWin10) setTooltipText('Open Windows Share Dialog')
      
      const isAndroid = inUserAgent('Android');
      // official name: https://developer.android.com/training/sharing/send
      if(isAndroid) setTooltipText('Open Android Sharesheet')
      
      const isiOS = inUserAgent('iPhone') || inUserAgent('iPad');
      // official name: https://support.apple.com/guide/shortcuts/share-sheet-input-types-apd7644168e1/ios
      if(isiOS) setTooltipText('Open iOS Share Sheet');
    }
    else {
      setTooltipText('Copy Link')
    }
    const isMac = navigator.userAgent.toLowerCase().indexOf('macintosh') >= 0;
  },[])

  return (
    <>
    <div className="new-container">
      <BlogNotifications />
    </div>
    <div className={`new-container ${styles.pankoRow}`}>
      <Panko />
      <div>
        <Tooltip title={tooltipText}>
          <IconButton color="primary" aria-label="Share" onClick={handleShare} className={interactivity.hoverActive}>
            <IosShareIcon />
          </IconButton>
        </Tooltip>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
          message={toasterMessage}
          anchorOrigin={{ vertical: isMobile ? 'bottom' : 'top', horizontal: 'right' }}
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
    </>
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
        return <span key={key}><Emoji symbol="📚" />Courses</span>
      }
      if(value.toLowerCase() === 'i') {
        return <span key={key}><Emoji symbol="🧑‍🏫" />Instructors</span>
      }
      if(value.toLowerCase() === 'g' || value.toLowerCase() === 'groups') {
        return <span key={key}><Emoji symbol="🗃️" />Groups</span>
      }
      if(value.toLowerCase() === 'faq') {
        return <span key={key}><Emoji symbol="💬" />FAQ</span>
      }
      if(value.toLowerCase() === 'top') {
        return <span key={key}><Emoji symbol="🔥" />Popular</span>
      }
    }
    if(index === 2) {
      if(array[1].toLowerCase() === 'g') {
        if(value === 'all-subjects') {
          return <span key={key}>All Subjects</span>
        }
        else if(value.startsWith('college')) {
          return <span key={key}>{curated_colleges.find(college => college.identifier === value)?.groupLongTitle}</span>
        }
        else {
          return <span key={key}>Group ID #{decodeURI(value)}</span>
        }
      }
      if(array[1].toLowerCase() === 'faq') {
        return <span key={key}>{capitalizeFirstLetter(decodeURI(value).split('-').join(' '))}</span>
      }
      if(array[1].toLowerCase() === 'top') {
        return <span key={key}>{POPULAR_TABS.find(e => e.slug === value)?.title ?? '???'}</span>
      }
      if(array[1].toLowerCase() === 'i') {
        return <span key={key} style={{ textTransform: 'capitalize' }}>{decodeURI(value)}</span>
      }
    }
    return <span key={key}>{decodeURI(value)}</span>
  })
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

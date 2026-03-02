import React, { useState, useEffect } from 'react'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Breadcrumbs, IconButton, Snackbar, Tooltip } from '@mui/material'
//import curated_colleges from '@cougargrades/publicdata/bundle/edu.uh.publications.colleges/curated_colleges_globbed_minified.json'
import { } from '@cougargrades/models'
import { PopulatedGroupResult } from '@cougargrades/models/dto'
import { is } from '@cougargrades/utils/zod'
import { isNullish } from '@cougargrades/utils/nullish'
import CloseIcon from '@mui/icons-material/Close'
import IosShareIcon from '@mui/icons-material/IosShare'
import { allPosts } from 'content-collections'
import { copyText } from '../lib/clipboard'
import { Emoji } from './emoji'
import { BlogNotifications } from './blog'
import { POPULAR_TABS } from '../lib/top'
import { useIsMobile } from '../lib/mediaQueries'

import styles from './panko.module.scss'
import interactivity from '../styles/interactivity.module.scss'


const strip = (path: string) => path.split(/[?|#]/).slice(0,1).join('')

export default function Panko() {
  //const router = useRouter();
  const location = useLocation();
  const breadcrumbs = useGenerateBreadcrumbs(strip(location.pathname))

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {breadcrumbs}
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

export function useGenerateBreadcrumbs(path: string) {
  //const queryClient = useQueryClient();
  // useQuery({
  //   queryKey: ['group', value]
  // })

  // TODO: split the path better

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
        // const data = queryClient.getQueryData(['group', value])
        // if (is(data, PopulatedGroupResult)) {
        //   return <span key={key}>{data.shortName ?? data.name}</span>
        // }
        // else {
        //   return <span key={key}>Group {decodeURIComponent(value)}</span>
        // }
        return <span key={key}>Group {decodeURIComponent(value)}</span>
      }
      if(array[1].toLowerCase() === 'faq') {
        const data = allPosts.find(p => p.slug === value)
        if (!isNullish(data)) {
          return <span key={key}>{data.title}</span>
        }
        else {
          return <span key={key}>{capitalizeFirstLetter(decodeURIComponent(value).split('-').join(' '))}</span>
        }
      }
      if(array[1].toLowerCase() === 'top') {
        return <span key={key}>{POPULAR_TABS.find(e => e.slug === value)?.title ?? '???'}</span>
      }
      if(array[1].toLowerCase() === 'i') {
        return <span key={key} style={{ textTransform: 'capitalize' }}>{decodeURIComponent(value)}</span>
      }
    }
    return <span key={key}>{decodeURIComponent(value)}</span>
  })
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

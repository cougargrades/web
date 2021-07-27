import { AtomEntry, AtomFeed, useAtomFeed } from '@au5ton/use-atom-feed';
import React from 'react'
import TimeAgo from 'timeago-react'
import { ReactFitty } from 'react-fitty'
import Stack from '@material-ui/core/Stack'
import Button from '@material-ui/core/Button'
import Alert, { AlertColor } from '@material-ui/core/Alert'
import AlertTitle from '@material-ui/core/AlertTitle'
import NewReleasesIcon from '@material-ui/icons/NewReleases'
import { Badge } from './badge'

import styles from './blog.module.scss'

export const BLOG_URL = 'https://blog.cougargrades.io/atom.xml'
//export const BLOG_URL = 'http://127.0.0.1:4000/atom.xml'

export default function Blog() {
  const previewLimit = 3;
  const { data, isValidating } = useAtomFeed(BLOG_URL);
  // Condition for determining if a post "has priority" or not
  const postHasPriority = (post: AtomEntry) => (new Date().valueOf() - post.updated.valueOf() < 6.048e8);
  // Has a blog entry been posted within the last week?
  const isPriorityBlogPosted = data !== undefined ? data.entries.findIndex(e => postHasPriority(e)) >= 0 : false;
  // The most recent blog post (entries are pre-sorted)
  const latestBlogPost = data !== undefined ? (data.entries.length > 0 ? data.entries[0] : undefined) : undefined;

  return (
    <details className={styles.blog}>
      <summary>
        Developer Updates{' '}
        {isPriorityBlogPosted ? (
          <Badge extraClassNames={styles.new}>
            New {latestBlogPost?.updated.toLocaleDateString()}
          </Badge>
        ) : (
          <></>
        )}
      </summary>
      <ul>
        {isValidating
          ? 'Loading...'
          : data?.entries.slice(0, previewLimit).map((e) => (
              <li key={e.id} className={postHasPriority(e) ? 'priority' : ''}>
                <a href={e.link![0].href}>{e.title.value}</a>,{' '}
                <span title={e.updated.toLocaleString()}>
                  <TimeAgo datetime={e.updated} locale={'en'} />
                </span>
              </li>
            ))}
        <li>
          <a href="https://blog.cougargrades.io">
            {data && Array.isArray(data.entries)
              ? `View ${data.entries.length - previewLimit} more posts →`
              : ''}
          </a>
        </li>
      </ul>
    </details>
  );
}

export function BlogNotifications() {
  const { data } = useAtomFeed(BLOG_URL);
  const notices = getNotices(data)

  return (
    <Stack className={styles.blogNotifications} spacing={1}>
      { notices.map(e => (
        <BlogNotice key={e.id} {...e} />
      ))}
    </Stack>
  );
}

export function BlogNotice({ title, bodyHTML, href, severity, variant, updated }: BlogNotice & { [key: string]: any }) {
  const alertSeverity = severity === '' ? 'info' : severity === 'new' ? 'warning' : severity;
  const icon = severity === 'new' ? <NewReleasesIcon fontSize="inherit" /> : undefined;
  const alertVariant = variant ? variant : 'standard';

  const action = <>
  <Stack direction="column" justifyContent="space-between" height="100%" maxWidth={75}>
    <ReactFitty><span title={updated.toLocaleString()}><TimeAgo className={styles.blogNoticeTime} datetime={updated} /></span></ReactFitty>
    <Button href={href} className={styles.blogNoticeAction} color="inherit" size="small">Open</Button>
  </Stack>
  </>

  return (
    <Alert severity={alertSeverity} variant={alertVariant} icon={icon} action={action}>
      <AlertTitle dangerouslySetInnerHTML={{ __html: title }}></AlertTitle>
      <div className={styles.blogNotice} dangerouslySetInnerHTML={{ __html: bodyHTML }}></div>
      
    </Alert>
  )
}

export interface BlogNotice {
  id: string;
  title: string;
  bodyHTML: string;
  href: string;
  updated: Date;
  expiry: Date;
  severity: '' | 'new' | AlertColor;
  variant?: 'standard' | 'filled' | 'outlined';
}

function getNotices(feed: AtomFeed): BlogNotice[] {
  if(feed !== undefined) {
    const notices = feed.entries.filter(e => e.link.filter(e => e.title === 'notice').length > 0)
    
    return notices.map(e => ({
      // extract what we can from the primary post information
      id: e.id,
      title: e.title.value,
      bodyHTML: e.content ? e.content.value : '',
      href: e.link ? e.link[0].href : '',
      // set defaults, we need to extract these from the embedded JSON object
      updated: undefined,
      expiry: undefined,
      severity: undefined as any,
      /**
       * allow us to override these properties if necessary, 
       * but only have the overriden properties visible for the notice message
       */
      ...JSON.parse(decodeDataURI(e.link.filter(e => e.title === 'notice')[0].href))
    }))
    // require that the "expiry" property be set
    .filter(e => e.expiry !== undefined && e.severity !== undefined && e.updated !== undefined)
    // put real values here
    .map(({ updated, expiry, ...o}) => ({
      updated: new Date(updated),
      expiry: new Date(expiry),
      ...o
    }))
    /**
     * require that expiry be in the future
     * for invalid dates, this condition 
     * will return false (desired behavior)
     */
    .filter(e => new Date() < new Date(e.expiry));
  }
  return [];
}

function decodeDataURI(dataURI: string): string {
  return decodeURI(dataURI.substring(dataURI.indexOf(',') + 1))
}

// const decodeAndUnescapeObject = (raw: { [key: string]: any }) => Object.keys(raw)
//   .reduce((obj, key) => {
//     if(typeof raw[key] === 'string') {
//       obj[key] = htmlDecodeEscapeEntities(raw[key]);
//     }
//     else {
//       obj[key] = raw[key];
//     }
//     return obj;
//   }, {});

// function htmlDecodeEscapeEntities(data: string): string {
//   return new DOMParser().parseFromString(data, 'text/html').documentElement.textContent;
// }

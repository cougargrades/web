import { AtomEntry, useAtomFeed } from '@au5ton/use-atom-feed';
import React from 'react';
import TimeAgo from 'timeago-react';

import { Badge } from './badge';

import styles from './blog.module.scss';

export default function Blog() {
  const previewLimit = 3;
  const { data, isValidating } = useAtomFeed('https://blog.cougargrades.io/atom.xml');
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
          <Badge className={styles.new}>
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
            {Array.isArray(data)
              ? `View ${data!.length - previewLimit} more posts →`
              : ''}
          </a>
        </li>
      </ul>
    </details>
  );
}

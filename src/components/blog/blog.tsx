import React from 'react';
import useSWR from 'swr';
import TimeAgo from 'timeago-react';

import Badge from '../root/badge';

import './blog.scss';

async function fetchBlogPosts() {
  // get blog post data
  let res = await fetch('https://cougargrades.github.io/blog/atom.xml');
  let data = await res.text();
  let parser = new DOMParser();
  let xml = parser.parseFromString(data, 'text/xml');
  let entries = [];
  for (const entry of xml.querySelectorAll('entry')) {
    entries.push({
      title: entry.querySelector('title')?.textContent,
      link: entry.querySelector('link')?.getAttribute('href'),
      updated: new Date(entry.querySelector('updated')?.textContent || 0),
      id: entry.querySelector('id')?.textContent,
      content: entry.querySelector('content')?.innerHTML,
      priority: false,
    });
  }
  entries.sort((a, b) => {
    return b.updated.valueOf() - a.updated.valueOf();
  });
  entries = entries.map((e) => {
    const weekMs = 6.048e8;
    if (Date.now().valueOf() - e.updated.valueOf() < weekMs) {
      e.priority = true;
    }
    return e;
  });
  return entries;
}

export default function Blog() {
  const previewLimit = 3;
  const { data, error, isValidating } = useSWR('do a thing', fetchBlogPosts);

  // Determines if a post has "priority"
  const hasPriority = () =>
    Array.isArray(data)
      ? data.map((e) => (e.priority ? 1 : 0)).reduce((e) => e) > 0
      : false;
  // gets the localized date string for the latest post
  const getLatestPost = () => (Array.isArray(data) ? data[0].updated : null);

  return (
    <details className="blog">
      <summary>
        Developer Updates{' '}
        {hasPriority() ? (
          <Badge className="new">
            New {getLatestPost()?.toLocaleDateString()}
          </Badge>
        ) : (
          <></>
        )}
      </summary>
      <ul className="blog">
        {isValidating
          ? 'Loading...'
          : data?.slice(0, previewLimit).map((e) => (
              <li key={e.id!} className={e.priority ? 'priority' : ''}>
                <a href={e.link!}>{e.title}</a>,{' '}
                <span title={e.updated.toLocaleString()}>
                  <TimeAgo datetime={e.updated} locale={'en'} />
                </span>
              </li>
            ))}
        <li>
          <a href="https://cougargrades.github.io/blog/">
            {Array.isArray(data)
              ? `View ${data!.length - previewLimit} more posts →`
              : ''}
          </a>
        </li>
      </ul>
    </details>
  );
}

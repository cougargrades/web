import Head from 'next/head'
import useSWR from 'swr/immutable'
import { ExternalLink } from '../components/link'
import { Collaborator, CollaboratorProps, CollaboratorSkeleton } from '../components/collaborator'
import { BlogNotifications } from '../components/blog'
import styles from '../styles/About.module.scss'

export default function About() {
  const isSingle = (x?: any[]) => Array.isArray(x) && x.length === 1;
  const { data, error, isValidating } = useSWR<CollaboratorResponse>('https://github-org-stats-au5ton.vercel.app/api/cougargrades');
  return (
    <>
      <Head>
        <title>About / CougarGrades.io</title>
        <meta name="description" content="About page" />
      </Head>
      <div className="new-container">
        <BlogNotifications />
        <h2>About</h2>
        <p>Started in Summer 2019, CougarGrades is an open-source web app for finding grade distribution information about courses and instructors at the University of Houston.</p>
        <h3>Resources</h3>
        <p className={styles.links}>
          <ExternalLink href="https://github.com/cougargrades/web">Source Code</ExternalLink>
          <ExternalLink href="https://github.com/cougargrades/api">Developer API</ExternalLink>
          <ExternalLink href="https://github.com/cougargrades/publicdata">Public Data</ExternalLink>
        </p>
        <h3>Developers</h3>
        <div
          className={styles.collaborators_wrap}
          style={isSingle(data?.public_members) || isValidating || error ? { justifyContent: 'flex-start' } : {}}
        >
          {isValidating
            ? [1].map(e => <CollaboratorSkeleton key={e} />)
            : data?.public_members?.map(e =>
                <Collaborator
                  key={e.id}
                  id={e.id}
                  name={e.name}
                  login={e.login}
                  html_url={e.html_url}
                  avatar_url={e.avatar_url}
                  avatar_blurhash={e.avatar_blurhash}
                />
              )}
        </div>
        {isValidating === false
          && !error
          && data
          && data.contributors.length > 0
          ? 
          <>
            <h4>Contributors</h4>
            <div
              className="collaborators-wrap"
              style={isSingle(data?.contributors) ? { justifyContent: 'flex-start' } : {}}
            >
              {isValidating
                ? 'Loading...'
                : data?.contributors?.map(e =>
                    <Collaborator
                      key={e.id}
                      id={e.id}
                      name={e.name}
                      login={e.login}
                      html_url={e.html_url}
                      avatar_url={e.avatar_url}
                      avatar_blurhash={e.avatar_blurhash}
                    />
                  )}
            </div>
          </>
          :
          <></>
          }
        <h4>Acknowledgement</h4>
        <p>Some other great projects we found inspiration in:</p>
        <ul>
          <li>
            anex.us/grades/ (
            <a href="https://github.com/heydabop/grades">@heydabop</a>)
          </li>
          <li>
            AggieScheduler (
            <a href="https://github.com/jake-leland">@jake-leland</a>)
          </li>
          <li>
            Good-Bull-Schedules (
            <a href="https://github.com/SaltyQuetzals">@SaltyQuetzals</a>)
          </li>
        </ul>
        <h4>Notice of Non-Affiliation and Disclaimer</h4>
        <p>
          <em>
            We are not affiliated, associated, authorized, endorsed by, or in any
            way officially connected with University of Houston, or any of its
            subsidiaries or its affiliates. The official University of Houston
            website can be found at http://www.uh.edu. The name “University of
            Houston” as well as related names, marks, emblems and images are
            registered trademarks of their respective owners.
          </em>
        </p>
        <h4>DMCA + Business</h4>
        <p>
          {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
          <a
            href="#"
            className={styles.cryptedmail}
            data-name="contact"
            data-domain="cougargrades"
            data-tld="io"
            onClick={(e) => {
              const s = (k: any, v: any) =>
                (e.target as HTMLElement).setAttribute(k, v);
              const g = (k: any) => (e.target as HTMLElement).getAttribute(k);
              s(
                'href',
                `mailto:${g('data-name')}@${g('data-domain')}.${g('data-tld')}`,
              );
            }}
          ></a>
        </p>
        <h4>License</h4>
        <p>
          This software is{' '}
          <a href="https://github.com/cougargrades/web/blob/master/LICENSE">
            MIT Licensed
          </a>
          .
        </p>
      </div>
    </>
  );
}

interface CollaboratorResponse {
  public_members: CollaboratorProps[],
  contributors: CollaboratorProps[]
}

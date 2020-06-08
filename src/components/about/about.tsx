import React, { Suspense } from 'react';
import useSWR from 'swr';

import Collaborator from '../collaborator/collaborator';
import Footer from '../footer/footer';

import './about.scss';

export default function About() {
  const isSingle = () => Array.isArray(members) && members.length === 1;
  const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json());
  // TODO: placeholder
  //const { data: members, error, isValidating } = useSWR('https://api.github.com/orgs/cougargrades/members', fetcher);

  const me = {
    login: 'au5ton',
    id: 4109551,
    node_id: 'MDQ6VXNlcjQxMDk1NTE=',
    avatar_url: 'https://avatars0.githubusercontent.com/u/4109551?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/au5ton',
    html_url: 'https://github.com/au5ton',
    followers_url: 'https://api.github.com/users/au5ton/followers',
    following_url: 'https://api.github.com/users/au5ton/following{/other_user}',
    gists_url: 'https://api.github.com/users/au5ton/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/au5ton/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/au5ton/subscriptions',
    organizations_url: 'https://api.github.com/users/au5ton/orgs',
    repos_url: 'https://api.github.com/users/au5ton/repos',
    events_url: 'https://api.github.com/users/au5ton/events{/privacy}',
    received_events_url: 'https://api.github.com/users/au5ton/received_events',
    type: 'User',
    site_admin: false,
  };

  const members: any = [];
  for (let i = 0; i < 2; i++) {
    let temp = Object.assign({}, me);
    temp.id = Math.random();
    members.push(temp);
  }

  return (
    <>
      <h3>Resources</h3>
      <p>
        <a className="button" href="https://github.com/cougargrades">
          Github
        </a>
        &nbsp;
        <a className="button" href="https://cougargrades.github.io/swagger/">
          Public API
        </a>
        &nbsp;
        <a className="button" href="https://github.com/cougargrades/publicdata">
          Public Data
        </a>
      </p>
      <h3>Collaborators</h3>
      <div
        className="collaborators-wrap"
        style={isSingle() ? { justifyContent: 'flex-start' } : {}}
      >
        {Array.isArray(members) &&
          members.map((e: any) => (
            <Collaborator
              key={e.id}
              login={e.login}
              avatar_url={e.avatar_url}
            />
          ))}
      </div>
      <h4>Acknowledgement</h4>
      <p>Some other great projects we found inspiration in:</p>
      <ul>
        <li>anex.us/grades/ (author unknown)</li>
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
      <h4>License</h4>
      <p>
        This software is{' '}
        <a href="https://github.com/cougargrades/web/blob/master/LICENSE">
          MIT Licensed
        </a>
        .
      </p>
      <Footer hideDisclaimer={true} />
    </>
  );
}

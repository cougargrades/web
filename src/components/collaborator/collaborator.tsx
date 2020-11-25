import React from 'react';

import './collaborator.scss';

export interface CollaboratorProps {
  id: number;
  name: string;
  login: string;
  html_url: string;
  avatar_url: string;
}

export default function Collaborator(props: CollaboratorProps) {
  return (
    <div className="collaborator">
      <a href={props.html_url}>
        <img src={props.avatar_url} />
      </a>
      <div className="user">
        <span className="name">{props.name}</span>
        <span className="login">{props.login}</span>
      </div>
    </div>
  );
}

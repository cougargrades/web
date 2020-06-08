import React from 'react';

import './collaborator.scss';

interface CollaboratorProps {
  login: string;
  avatar_url: string;
}

export default function Collaborator(props: CollaboratorProps) {
  return (
    <div className="collaborator">
      <a href="#">
        <img src={props.avatar_url} />
      </a>
      <div className="user">
        <span className="name">John Doe</span>
        <span className="login">{props.login}</span>
      </div>
    </div>
  );
}

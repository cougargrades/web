import React, { CSSProperties, ReactElement } from 'react';

import './badge.scss';

interface BadgeProps {
  className?: string;
  title?: string;
  style?: CSSProperties;
}

export const Badge: React.FC<BadgeProps> = (props) => {
  return (
    <span className={`badge ${props.className}`} style={props.style} title={props.title}>{props.children}</span>
  )
}
import React, { CSSProperties } from 'react';

import './badge.scss';

interface BadgeProps {
  className?: string;
  title?: string;
  style?: CSSProperties;
  children: any;
}

export default function Badge(props: BadgeProps) {
  return (
    <span
      className={`badge ${props.className}`}
      style={props.style}
      title={props.title}
    >
      {props.children}
    </span>
  );
}

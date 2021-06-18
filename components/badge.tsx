import React, { CSSProperties } from 'react';

import styles from './badge.module.scss';

interface BadgeProps {
  extraClassNames?: string;
  title?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export function Badge(props: BadgeProps) {
  return (
    <span
      className={`${styles.badge} ${props.extraClassNames}`}
      style={props.style}
      title={props.title}
    >
      {props.children}
    </span>
  );
}

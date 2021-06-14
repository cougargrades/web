import React, { CSSProperties } from 'react';

import styles from './badge.module.scss';

interface BadgeProps {
  className?: string;
  title?: string;
  style?: CSSProperties;
  children: any;
}

export function Badge(props: BadgeProps) {
  return (
    <span
      className={styles.badge}
      style={props.style}
      title={props.title}
    >
      {props.children}
    </span>
  );
}

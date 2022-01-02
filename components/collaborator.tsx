import React, { useState } from 'react'
import Image from 'next/image'
import Skeleton from '@mui/material/Skeleton'
import styles from './collaborator.module.scss'

export interface CollaboratorProps {
  id: number;
  name: string;
  login: string;
  html_url: string;
  avatar_url: string;
  avatar_blurhash?: {
    blurhash: string;
    dataURI: string;
  }
}

export function Collaborator(props: CollaboratorProps) {
  return (
    <div className={styles.collaborator}>
      <a href={props.html_url}>
        <Image
          src={props.avatar_url}
          alt={`${props.name}'s avatar`}
          width={460}
          height={460}
          placeholder={props.avatar_blurhash ? "blur" : undefined}
          blurDataURL={props.avatar_blurhash?.dataURI}
        />
      </a>
      <div className={styles.user}>
        <span className={styles.name}>{props.name}</span>
        <span className={styles.login}>{props.login}</span>
      </div>
    </div>
  );
}

export function CollaboratorSkeleton() {
  return (
    <div className={styles.collaborator}>
      <a>
        <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
      </a>
      <div className={styles.user}>
        <span className={styles.name}><Skeleton variant="text" width={140} /></span>
        <span className={styles.login}><Skeleton variant="text" width={60} /></span>
      </div>
    </div>
  );
}

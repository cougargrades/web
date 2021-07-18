import Image from 'next/image'
import styles from './collaborator.module.scss'

export interface CollaboratorProps {
  id: number;
  name: string;
  login: string;
  html_url: string;
  avatar_url: string;
  avatar_blurhash: {
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
          placeholder="blur"
          blurDataURL={props.avatar_blurhash.dataURI}
        />
        {/* <img alt={`${props.name}'s avatar`} src={props.avatar_url} /> */}
      </a>
      <div className={styles.user}>
        <span className={styles.name}>{props.name}</span>
        <span className={styles.login}>{props.login}</span>
      </div>
    </div>
  );
}

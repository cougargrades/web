import { NextPageContext } from 'next'
import styles from '../styles/Error.module.scss'

interface ErrorProps {
  statusCode: number;
  title: string;
}

export default function ErrorPage(props: ErrorProps) {
  const { statusCode, title } = props
  return (
    <div className={styles.error}>
      <div>
        <h1>{statusCode}</h1>
        <div className={styles.title}>
          <h2>{title}</h2>
        </div>
      </div>
    </div>
  )
}

ErrorPage.getInitialProps = (ctx: NextPageContext): ErrorProps => {
  const { res, err } = ctx;
  const statusCode = res && res.statusCode ? res.statusCode : err && err.statusCode ? err.statusCode : 404;
  const title = (res && res.statusMessage) ? res.statusMessage : err ? err.message : 'This page could not be found.';
  return { statusCode, title }
}

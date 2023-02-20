import styles from './emoji.module.scss'

export function Emoji(props: { label?: string, symbol: string } & Partial<React.HTMLAttributes<HTMLSpanElement>>) {
  return (
    <span 
      className={styles.emoji}
      role="img"
      aria-label={props.label ? props.label : ''}
      aria-hidden={props.label ? 'false' : 'true'}
      {...props}
      >
      {props.symbol}
    </span>
  )
}
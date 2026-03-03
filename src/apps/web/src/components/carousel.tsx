import styles from './carousel.module.scss'

export function Carousel({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.carousel}>
      {children}
    </div>
  )
}
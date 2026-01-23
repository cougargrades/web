import React from 'react'
import Header from '~/components/header'
import Footer from '~/components/footer'
import styles from './layout.module.scss'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.layout}>
        <Header />
        {props.children}
      </div>
      <span>footer</span>
      {/* <Footer /> */}
    </>
  )
}

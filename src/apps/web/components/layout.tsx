import React from 'react'
import dynamic from 'next/dynamic'
import Header from '../components/header'
//const Header = dynamic(() => import('../components/header'))
import Footer from '../components/footer'
//const Footer = dynamic(() => import('../components/footer'))
import styles from './layout.module.scss'

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.layout}>
        <Header />
        {props.children}
      </div>
      <Footer />
    </>
  )
}

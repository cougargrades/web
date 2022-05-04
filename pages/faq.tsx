import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { ExternalLink } from '../components/link'
import { BlogNotifications } from '../components/blog'
import { ExampleTable } from '../components/example_table';
import { FaqPostData, getAllPosts } from '../lib/faq'

import styles from '../styles/FAQ.module.scss'
import interactivity from '../styles/interactivity.module.scss'
import { Typography } from '@mui/material'

export interface FaqIndexProps {
  allPosts: FaqPostData[];
}

export default function FrequentlyAskedQuestions({ allPosts }: FaqIndexProps) {
  return (
    <>
      <Head>
        <title>FAQ / CougarGrades.io</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <div className="new-container">
        <BlogNotifications />
        <h2>Frequently Asked Questions</h2>
        <p>These are some of the frequently asked questions that we receive.</p>
      
        {/* <Container> */}
          <List className={styles.faqList}>
            {allPosts.map(other => (
                <div key={other.slug}>
                  <Link href={`/faq/${other.slug}`}>
                    <ListItemButton
                      classes={{ root: `${styles.faqButton} ${interactivity.hoverActive}` }}
                      dense
                      >
                      <ListItemText
                        primary={<Typography variant="subtitle2" sx={{ pt: 0, fontSize: '1.0em' }} color={theme => theme.palette.text.primary}>{other.title}</Typography>}
                        />
                    </ListItemButton>
                  </Link>
                </div>
              ))}
          </List>
        {/* </Container> */}
      </div>
      <div>
        <p>These are some of the frequently asked questions that we receive.</p>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Is CougarGrades meant to shame instructors for being too hard/easy?
          </blockquote>
          <p>
            First and foremost, CougarGrades is about bringing <strong>transparent, unbiased information to students</strong> so that they can make informed decisions in one of the most challenging times of their young-adult lives: College.
          </p>
          <p>
            A <em>very</em> important principle to me when designing and developing CougarGrades was to curate the generalized statistics that students want to know about, but leave the data as <strong>open to interpretation</strong> as possible.
            This is <em>exactly</em> why CougarGrades doesn&apos;t have pages like &quot;top 10 lowest GPA instructors in the school: avoid at all costs&quot;.
            If pages like this existed, they would be over-extrapolating data to slander instructors who are already underpaid and underappreciated enough as it is.
          </p>
          <p>
            That said, if an instructor or individual doesn&apos;t like the way that the data on the site represents them, I can&apos;t do anything about that.
            The University of Houston is a public university, obligated to be transparent about its operations. Being transparent means being open to scrutiny and being held accountable.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            I love the website! Can I give you money?
          </blockquote>
          <p>
            CougarGrades accepts donations via GitHub Sponsors. If you are interested in supporting the project or showing your appreciation, you may consider donating.
          </p>
          <iframe className={styles.githubSponsor} src="https://github.com/sponsors/au5ton/button" title="Sponsor au5ton" width="116" height="35" ></iframe>
          <p>
            If you&apos;d like to show your appreciation or other feedback in ways that don&apos;t cost money, please visit our <a href="https://github.com/cougargrades/web/wiki/Feedback">feedback page</a>.
          </p>
          <p>
            As a reminder, CougarGrades will always be free, open-source, and not for profit. No content on CougarGrades.io will ever be hidden behind a paywall.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Is this website affiliated, associated, authorized, endorsed by, or in any way officially connected with the University of Houston?
          </blockquote>
          <p>
            No.
          </p>
        </section>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<FaqIndexProps> = async ({ params }) => {
  return { 
    props: { 
      allPosts: [
        ...getAllPosts(['slug','title'])
      ]
    }
  };
}

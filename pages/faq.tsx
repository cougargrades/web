import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorIcon from '@mui/icons-material/Error';
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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(allPosts.length > 0 && allPosts[0].slug) {
      router.replace(`/faq/${allPosts[0].slug}`, undefined, { scroll: false });
    }
    else {
      setIsLoading(false)
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>FAQ / CougarGrades.io</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <div className="new-container">
        <Stack
          sx={{
            height: '100px'
          }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          >
          {
          isLoading ? <>
          <Typography variant="h6">Loading FAQ...</Typography>
          <CircularProgress />
          </> : <>
          <Typography variant="h6">No FAQs were found</Typography>
          <ErrorIcon fontSize="large" color="error" />
          </>
          }
        </Stack>
        {/* <BlogNotifications />
        <h2>Frequently Asked Questions</h2>
        <p>These are some of the frequently asked questions that we receive.</p>
      
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
        </List> */}
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

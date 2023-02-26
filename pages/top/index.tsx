import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import ErrorIcon from '@mui/icons-material/Error'
import { FaqPostData, getAllPosts } from '../../lib/faq'
import { POPULAR_TABS } from '../../lib/top'

export interface FaqIndexProps {
  allPosts: FaqPostData[];
}

export default function Popular({ allPosts }: FaqIndexProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if(allPosts.length > 0 && allPosts[0].slug) {
      router.replace(`/top/${allPosts[0].slug}`, undefined, { scroll: false });
    }
    else {
      setIsLoading(false)
    }
  }, []);
  
  return (
    <>
      <Head>
        <title>Popular / CougarGrades.io</title>
        <meta name="description" content="Popular Courses and Instructors" />
      </Head>
      <div className="new-container">
        <Stack
          sx={{
            height: '100px',
            paddingBottom: '25px',
          }}
          justifyContent="center"
          alignItems="center"
          spacing={2}
          >
          {
          isLoading ? <>
          <Typography variant="h6">Loading...</Typography>
          <CircularProgress />
          </> : <>
          <Typography variant="h6">No Popular pages were found</Typography>
          <ErrorIcon fontSize="large" color="error" />
          </>
          }
        </Stack>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<FaqIndexProps> = async ({ params }) => {
  return { 
    props: { 
      allPosts: [
        ...POPULAR_TABS
      ]
    }
  };
}

import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

export default function RandomEitherRedirect() {
  const router = useRouter()

  useEffect(() => {
    const model: 'course' | 'instructor' = Math.random() > 0.5 ? 'course' : 'instructor'
    const path = `/random/${model}`
    router.replace(path, undefined, { scroll: false });
  }, []);
  
  return (
    <>
      <Head>
        <title>Random / CougarGrades.io Random</title>
        <meta name="description" content="A random Course or Instructor" />
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
          <Typography variant="h6">Loading...</Typography>
          <CircularProgress />
        </Stack>
      </div>
    </>
  );
}

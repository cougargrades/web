import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import all_courses from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_courses.json'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { getRandomIndexes } from '../../lib/util'

export default function RandomCourseRedirect() {
  const router = useRouter()

  useEffect(() => {
    const randomItemName: string = getRandomIndexes(all_courses.length, 1).map(index => all_courses[index])[0];
    const path = `/c/${randomItemName}`
    router.replace(path, undefined, { scroll: false });
  }, []);
  
  return (
    <>
      <Head>
        <title>Random Course / CougarGrades.io Random</title>
        <meta name="description" content="A random Course" />
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
          <Typography variant="h6">Loading random course...</Typography>
          <CircularProgress />
        </Stack>
      </div>
    </>
  );
}

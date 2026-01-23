import React, { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import all_instructors from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_instructors.json'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import { getRandomIndexes } from '../../lib/util'

export default function RandomInstructorRedirect() {
  const router = useRouter()

  useEffect(() => {
    const randomItemName: string = getRandomIndexes(all_instructors.length, 1).map(index => all_instructors[index])[0];
    const path = `/i/${randomItemName}`
    router.replace(path, undefined, { scroll: false });
  }, []);
  
  return (
    <>
      <Head>
        <title>Random Instructor / CougarGrades.io Random</title>
        <meta name="description" content="A random Instructor" />
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
          <Typography variant="h6">Loading random instructor...</Typography>
          <CircularProgress />
        </Stack>
      </div>
    </>
  );
}

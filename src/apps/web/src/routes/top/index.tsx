import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'
import { POPULAR_TABS } from '../../lib/top';


export const Route = createFileRoute('/top/')({
  head: (ctx) => ({
    meta: [
      { title: `Popular / CougarGrades.io` },
      { name: 'description', content: 'Popular Courses and Instructors' }
    ]
  }),
  loader(ctx) {
    return redirect({
      to: '/top/$slug',
      params: { slug: POPULAR_TABS[0].slug ?? '' }
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
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
  )
}

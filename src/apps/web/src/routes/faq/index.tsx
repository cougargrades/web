import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'
//@ts-ignore this chicken-vs-egg crap is pissing me off
import { allPosts } from 'content-collections'

export const Route = createFileRoute('/faq/')({
  head: (ctx) => ({
    meta: [
      { title: `FAQ / CougarGrades.io` },
      { name: 'description', content: 'Frequently Asked Questions' }
    ]
  }),
  loader(ctx) {
    return redirect({
      to: '/faq/$slug',
      params: { slug: allPosts[0].slug }
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

import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'

export const Route = createFileRoute('/random/')({
  loader(ctx) {
    if (Math.random() > 0.5) {
      return redirect({
        to: '/random/course'
      })
    }
    else {
      return redirect({
        to: '/random/instructor'
      })
    }
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
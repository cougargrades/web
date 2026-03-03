import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'

export const Route = createFileRoute('/random/instructor')({
  async loader(ctx) {
    const { default: all_instructors } = await import('@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_instructors.json')
    const index = Math.floor(Math.random() * all_instructors.length);
    const instructorName = all_instructors[index];

    return redirect({
      to: '/i/$instructorName',
      params: { instructorName }
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

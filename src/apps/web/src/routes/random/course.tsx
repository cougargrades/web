import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'

export const Route = createFileRoute('/random/course')({
  async loader(ctx) {
    const { default: all_courses } = await import('@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_courses.json')
    const index = Math.floor(Math.random() * all_courses.length);
    const courseName = all_courses[index];

    return redirect({
      to: '/c/$courseName',
      params: { courseName }
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

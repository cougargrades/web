import { createFileRoute, redirect } from '@tanstack/react-router'
import { CircularProgress, Stack, Typography } from '@mui/material'
import all_instructors from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/all_instructors.json'

export const Route = createFileRoute('/random/instructor')({
  loader(ctx) {
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

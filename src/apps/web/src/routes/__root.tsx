import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { ThemeProvider } from '@mui/material/styles'
import { useTheme } from '../lib/theme'
import { PageViewLogger } from '../components/PageViewLogger'
import { Layout } from '../components/layout'

export const Route = createRootRoute({
  component: RootComponent,
})

import '../styles/new.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'
import 'nprogress/nprogress.css'
import '../styles/nprogress-custom.scss'
import '../styles/globals.scss'
import '../styles/colors.scss'
import '../styles/syntax-highlighting.scss'

function RootComponent() {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <PageViewLogger />
      <Layout>
        <Outlet />
      </Layout>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </ThemeProvider>
  )
}

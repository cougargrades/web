import * as React from 'react'
import { HeadContent, Link, Outlet, Scripts, createRootRoute, createRootRouteWithContext, type ErrorComponentProps } from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { useTheme } from '../lib/theme'
import { PageViewLogger } from '../components/PageViewLogger'
import { Layout } from '../components/layout'

//createRootRoute

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0' },
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { name: "google-site-verification", content: "6Ci3V-jOwFCqFvntbRrkdoxF7MB4DC5gI_wWNz9fNTI" },
      { title: `CougarGrades.io: Grade distribution data for UH` },
      { name: 'description', content: `Analyze grade distribution data for any past University of Houston course. Compare past instructors, compare multiple courses. Open source data and code.` },
    ]
  }),
  // shellComponent: RootShell,
  // component: RootComponent,
  // ssr: false,

  //shellComponent: RootShell,
  component: StartRootComponent,
  //ssr: false,
  //errorComponent: ErrorComponent,
})

import errorStyles from '../styles/Error.module.scss'

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
  const context = Route.useRouteContext();

  return (
    <>
    {/* <HeadContent /> */}
    <QueryClientProvider client={context.queryClient}>
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
    </QueryClientProvider>
    </>
  )
}

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function StartRootComponent() {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <RootComponent />
        <Scripts />
      </body>
    </html>
  )
}

function ErrorComponent({ error, info }: ErrorComponentProps) {
  return (
    <div className={errorStyles.error}>
      <div>
        <h1>{error.name}</h1>
        <div className={errorStyles.title}>
          <h2>{error.message}</h2>
        </div>
      </div>
    </div>
  )
}

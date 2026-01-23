/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { RecoilRoot } from 'recoil'
// import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
// import { NotFound } from '~/components/NotFound'
import { useTheme } from '~/lib/theme'
import Layout from '~/components/layout'

import { seo } from '~/utils/seo'

//import appCss from '~/styles/app.css?url'
import '~/styles/new.css'
import '~/styles/new.css';
import 'bootstrap/dist/css/bootstrap-grid.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'
import 'nprogress/nprogress.css'
import '~/styles/nprogress-custom.scss'
import '~/styles/globals.scss'
import '~/styles/colors.scss'
import '~/styles/syntax-highlighting.scss'



export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'minimum-scale=1, initial-scale=1, width=device-width',
      },
      ...seo({
        title: `CougarGrades.io: Grade distribution data for UH`,
        description: `Analyze grade distribution data for any past University of Houston course. Compare past instructors, compare multiple courses. Open source data and code.`,
      }),
      {
        name: 'google-site-verification',
        content: `6Ci3V-jOwFCqFvntbRrkdoxF7MB4DC5gI_wWNz9fNTI`
      }
    ],
    links: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),
  // errorComponent: DefaultCatchBoundary,
  // notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="__next">
          <ThemeProvider theme={theme}>
            <RecoilRoot>
              <Layout>
                {children}
              </Layout>
            </RecoilRoot>
          </ThemeProvider>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}

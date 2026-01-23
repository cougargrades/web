import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
//import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
//import { NotFound } from './components/NotFound'
import ErrorPage from '~/components/ErrorPage'

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    //defaultErrorComponent: DefaultCatchBoundary,
    //defaultNotFoundComponent: () => <NotFound />,
    defaultNotFoundComponent: () => <ErrorPage statusCode={404} title="Not Found" />,
    scrollRestoration: true,
  })

  return router
}

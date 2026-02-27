import { useEffect } from 'react'
import { createFileRoute, notFound, useRouter } from '@tanstack/react-router'
import { Container, Typography } from '@mui/material'
import { isNullish } from '@cougargrades/utils/nullish'
import TimeAgo from 'timeago-react'
import { allPosts } from 'content-collections'
//import type { PostSchema } from '../../../content-collections'
import { SidebarContainer, type SidebarItem } from '../../components/sidebarcontainer'
import { PankoRow } from '../../components/panko'
import { FaqPostBody } from '../../components/faqpostbody'

import styles from './slug.module.scss'
import interactivity from '../../styles/interactivity.module.scss'

export const Route = createFileRoute('/faq/$slug')({
  head: (ctx) => {
    const post = allPosts.find(p => p.slug === ctx.params.slug);
    return {
      meta: [
        { title: isNullish(post) ? `FAQ / CougarGrades.io` : `${post.title} / CougarGrades.io FAQ` },
        { name: 'description', content: 'Frequently Asked Questions' }
      ]
    }
  },
  loader(ctx) {
    const post = allPosts.find(p => p.slug === ctx.params.slug);
    if (isNullish(post)) {
      return notFound();
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams();
  const post = allPosts.find(p => p.slug === slug);
  const router = useRouter();

  const sidebarItems: SidebarItem[] = Array.isArray(allPosts) ? allPosts.map(post => ({
    key: post.slug,
    categoryName: 'Frequently Asked Questions',
    title: post.title,
    href: `/faq/${post.slug}`,
  })) : [];

  useEffect(() => {
    for(let item of sidebarItems) {
      if (item.href) {
        router.preloadRoute({ to: item.href });
      }
    }
  }, [sidebarItems]);

  return (
    <>
      <Container>
        <PankoRow />
      </Container>
      <SidebarContainer condensedTitle="Frequently Asked Questions" sidebarItems={sidebarItems}>
        <div className={styles.articleContainer}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Frequently Asked Question:
          </Typography>
          <FaqPostBody content={post?.content ?? ''} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last modified: <TimeAgo datetime={post?.date ?? ''} locale={'en'} />
          </Typography>
        </div>
      </SidebarContainer>
    </>
  );
}

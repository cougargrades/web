import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticPaths, GetStaticProps } from 'next'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { ExternalLink, FakeLink } from '../../components/link'
import { BlogNotifications } from '../../components/blog'
import { ExampleTable } from '../../components/example_table'
import { FaqPostBody } from '../../components/faqpostbody'

import { getPostBySlug, getAllPosts, FaqPostData, markdownToHtml } from '../../lib/faq'

//import styles from '../../styles/FAQ.module.scss'
import styles from './faq.module.scss'
import interactivity from '../../styles/interactivity.module.scss'
import { GroupNavSubheader, TableOfContentsWrap } from '../../components/groupnav'
import { tocAtom } from '../../lib/recoil'
import { useRecoilState } from 'recoil'
import TimeAgo from 'timeago-react'
import { useIsCondensed } from '../../lib/hook'

export interface FaqPostProps {
  post: FaqPostData;
  allPosts: FaqPostData[];
}

export default function FaqPost({ post, allPosts }: FaqPostProps) {
  const router = useRouter()
  const [_, setTOCExpanded] = useRecoilState(tocAtom)
  const condensed = useIsCondensed()

  const handleClick = (other: FaqPostData) => {
    router.push(`/faq/${other.slug}`, undefined, { scroll: false })
    setTOCExpanded(false)
  }
  if (!router.isFallback && !post?.slug) {
    //return <ErrorPage statusCode={404} />
    return <p>error 404</p>
  }
  return (
    <>
      <Head>
        <title>{post.title} / CougarGrades.io FAQ</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <div className="new-container">
        <BlogNotifications />
      </div>
      <main className={styles.main}>
        <aside className={styles.nav}>
          <TableOfContentsWrap condensedTitle={condensed ? 'Frequently Asked Questions' : ''}>
            <List className={styles.sidebarList} subheader={condensed ? undefined : <GroupNavSubheader>Frequently Asked Questions</GroupNavSubheader>}>
              {allPosts.map(other => (
                <React.Fragment key={other.slug}>
                  <FakeLink href={`/faq/${other.slug}`}>
                    <ListItemButton
                      selected={other.slug === post.slug}
                      onClick={() => handleClick(other)}
                      classes={{ root: `${styles.accordionRoot} ${interactivity.hoverActive}`, selected: styles.listItemSelected }}
                      dense
                      >
                      <ListItemText
                        primary={other.title}
                        primaryTypographyProps={{
                          color: (theme) => (other.slug === post.slug) ? theme.palette.text.primary : theme.palette.text.secondary,
                          fontWeight: 'unset'
                        }}
                        />
                    </ListItemButton>
                  </FakeLink>
                </React.Fragment>
              ))}
            </List>
          </TableOfContentsWrap>
        </aside>
        <article>
          {/* <h2>{post.title}</h2> */}
          <div className={styles.articleContainer}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Frequently Asked Question:
            </Typography>
            <FaqPostBody content={post.content} />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last modified: <TimeAgo datetime={post.date} locale={'en'} />
            </Typography>
          </div>
        </article>
      </main>
      {/* {router.isFallback ? (
        <h2>Loading…</h2>
      ) : (
        <>
          <article>
            <h2>{post.title}</h2>
            <FaqPostBody content={post.content} />
          </article>
        </>
      )} */}
        
        {/* <section className={styles.section}>
          <blockquote className={styles.question}>
            Where do you get the grade data? Is it real?
          </blockquote>
          <p>
            We use data sourced via the{' '}
            <em>Texas Public Information Act</em> and provided by the UH{' '}
            <a href="https://www.uh.edu/legal-affairs/general-counsel/texas-public-information/">
              Office of the General Counsel
            </a>
            , among other official sources. <strong>Simply put, we send UH a formal email and ask 
            for it.</strong> To promote trust and collaboration, we&apos;ve published all the data 
            used by our site so anyone can inspect it and use it in their own creative ways.
          </p>
          <p><ExternalLink href="https://github.com/cougargrades/publicdata">Public Data</ExternalLink></p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            When will Fall/Spring/Summer 20XX data get added?
          </blockquote>
          <p>
            As of January 27, 2022, requests for new grade data are sent automatically via email to UH.
          </p>
          <ul>
            <li><strong>Fall data</strong> is requested on <u>January 28 every year</u>.</li>
            <li><strong>Spring data</strong> is requested on <u>May 30 every year</u>.</li>
            <li><strong>Summer data</strong> is requested on <u>August 30 every year</u>.</li>
          </ul>
          <p>
            This is to give UH time to finalize their grades and so we are not harassing their staff after or during any holidays. UH typically takes about a week to respond with the data, and sometimes even longer. Once we have the data from UH, adding the data to the site is a semi-automated process that takes about 1-2 hours.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Is all the grade data accurate?
          </blockquote>
          <p>
            All grade data on CougarGrades is directly from UH and is 100% authentic.
          </p>
          <p>However...</p>
          <p>
            The grade data provided directly by UH can sometimes have some holes, or missing data, in it.
            Sometimes these holes aren&apos;t just areas where a number is left blank, but instead left with a 0 instead,
            when a zero doesn&apos;t make sense in context. For example, a section may be included, but for all letter grades 0 is 
            listed (0 As were given, 0 Bs were given, etc). <strong>This is especially evident for instructors 
            who teach Graduate courses instead of Undergraduate courses</strong>.
          </p>
          <p>
            Whenever we process the grade data, we ignore areas where UH leaves missing data in the calculations.
            Unfortunately, for the case where a 0 is left where it shouldn&apos;t be, there&apos;s nothing we can do
            but include it in the data result, because that 0 could actually be true.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Sometimes the &quot;GPA&quot; column is inconsistent with the letter grades that the students actually received. What does this mean? What should I believe?
          </blockquote>
          <p>
            This is a very clever observation, and there&apos;s supposedly a rational explanation for this.
            Generally speaking, the data we receive from UH looks like this:
          </p>
          <ExampleTable />
          <p>The &quot;AVG GPA&quot; column is what CougarGrades uses in its statistics. By design, we do not recompute this value based on the number of letter grades received.</p>
          <p>
            You can very obviously see that the bottom 2 rows don&apos;t have &quot;AVG GPA&quot; columns that make sense. However, this data is <em>exactly</em> as UH provided it (with no official explanation). What gives?
          </p>
          <p>
            From this, we can infer that: <u>The GPA that UH provides is not necessarily the GPA that could be calculated from the grade letters received</u>. 
            The leading theory we&apos;ve <em><abbr title="speculate (verb): form a theory or conjecture about a subject without firm evidence.">speculated</abbr></em> from this is:
          </p>
          <p>
            The GPA that UH provides is the &quot;real&quot; GPA that isn&apos;t affected by &quot;S&quot; and &quot;NCR&quot; grades. In other words, it&apos;s the average GPA of what the students <em>would have</em> made if they didn&apos;t receive S or NCR grades, and accounts for all the Cs, Ds, and Fs that would&apos;ve been given in the course.
          </p>
          <p>
            With this in mind, it makes a lot of the lower &quot;AVG GPA&quot; values seem pretty bleak, although this is most likely attributed due to the COVID-19 global pandemic and the abrupt transition to online classes.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Is CougarGrades meant to shame instructors for being too hard/easy?
          </blockquote>
          <p>
            First and foremost, CougarGrades is about bringing <strong>transparent, unbiased information to students</strong> so that they can make informed decisions in one of the most challenging times of their young-adult lives: College.
          </p>
          <p>
            A <em>very</em> important principle to me when designing and developing CougarGrades was to curate the generalized statistics that students want to know about, but leave the data as <strong>open to interpretation</strong> as possible.
            This is <em>exactly</em> why CougarGrades doesn&apos;t have pages like &quot;top 10 lowest GPA instructors in the school: avoid at all costs&quot;.
            If pages like this existed, they would be over-extrapolating data to slander instructors who are already underpaid and underappreciated enough as it is.
          </p>
          <p>
            That said, if an instructor or individual doesn&apos;t like the way that the data on the site represents them, I can&apos;t do anything about that.
            The University of Houston is a public university, obligated to be transparent about its operations. Being transparent means being open to scrutiny and being held accountable.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            I love the website! Can I give you money?
          </blockquote>
          <p>
            CougarGrades accepts donations via GitHub Sponsors. If you are interested in supporting the project or showing your appreciation, you may consider donating.
          </p>
          <iframe className={styles.githubSponsor} src="https://github.com/sponsors/au5ton/button" title="Sponsor au5ton" width="116" height="35" ></iframe>
          <p>
            If you&apos;d like to show your appreciation or other feedback in ways that don&apos;t cost money, please visit our <a href="https://github.com/cougargrades/web/wiki/Feedback">feedback page</a>.
          </p>
          <p>
            As a reminder, CougarGrades will always be free, open-source, and not for profit. No content on CougarGrades.io will ever be hidden behind a paywall.
          </p>
        </section>
        <section className={styles.section}>
          <blockquote className={styles.question}>
            Is this website affiliated, associated, authorized, endorsed by, or in any way officially connected with the University of Houston?
          </blockquote>
          <p>
            No.
          </p>
        </section> */}
    </>
  );
}

// See: https://nextjs.org/docs/basic-features/data-fetching#fallback-true
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts(['slug']);

  return {
    paths: posts.map(post => ({
      params: {
        slug: post.slug
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<FaqPostProps> = async ({ params }) => {
  const post = getPostBySlug(Array.isArray(params.slug) ? params.slug[0] : params.slug, ['slug','title', 'date','content']);
  const content = await markdownToHtml(post.content || '');

  return { 
    props: { 
      post: {
        ...post,
        content
      },
      allPosts: [
        ...getAllPosts(['slug','title'])
      ]
    }
  };
}

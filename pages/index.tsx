import Image from 'next/image'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Layout from '../components/layout'
import Blog from '../components/blog'
import slotmachine from '../public/slotmachine.svg'
import wordcloud from '../public/wordcloud.svg'
import styles from '../styles/Homepage.module.scss'

export default function Home() {
  return (
    <Layout>
      <div className="new-container">
        <main className={styles.main}>
          <Blog />
          <div className="row g-0">
            <div className="col-sm-6">
              <section>
                <h2>Find every course.</h2>
                <p>
                  Plan your degree with the knowledge to succeed. With data from
                  Fall 2013 to present, we have information about every course and
                  section taught at UH.
                </p>
                <div className="stamp-wrap">
                  <div className={`${styles.stamp} ${styles.teal} ${styles.bignumber}`}>103k</div>
                  <span className={styles.stamp_caption}>Sections</span>
                  <div className={`${styles.stamp} ${styles.gold}`}>6.9k</div>
                  <span className={styles.stamp_caption}>Courses</span>
                </div>
                <br />
                <p>
                  <InternalLink href="/courses">Search Courses</InternalLink>
                </p>
              </section>
            </div>
            <div className="col-sm-6">
              <figure>
                <Image
                  src={slotmachine}
                  alt="Top 48 most enrolled courses at UH."
                  className={styles.visaid}
                />
                <figcaption>Top 48 most enrolled courses at UH.</figcaption>
              </figure>
            </div>
            <div className="col-sm-6">
              <section className="instructors">
                <h2>Know your instructors.</h2>
                <p>
                  Gain insight by learning more about <em>who</em> your professors
                  are. View previously taught courses and compare grades that
                  their students received.
                </p>
                <div>
                  <div className={`${styles.stamp} ${styles.blue}`}>5.4k</div>
                  <span className={styles.stamp_caption}>Instructors</span>
                  <div className={`${styles.stamp} ${styles.orchid}`}>149</div>
                  <span className={styles.stamp_caption}>Departments</span>
                </div>
                <br />
                <p>
                  <InternalLink href="/instructors">Search Instructors</InternalLink>
                </p>
              </section>
            </div>
            <div className="col-sm-6">
              <figure>
                <Image
                  src={wordcloud}
                  alt="Top 100 unique instructor lastnames, weighted by number of sections taught."
                  className={styles.visaid}
                />
                <figcaption>Top 100 unique instructor lastnames.</figcaption>
              </figure>
            </div>
            <section>
              <h3>Public data. Open data.</h3>
              <p>
                We use data sourced via the{' '}
                <em>Texas Public Information Act</em> and provided by the UH{' '}
                <a href="https://www.uh.edu/legal-affairs/general-counsel/texas-public-information/">
                  Office of the General Counsel
                </a>
                , among other official sources. To promote trust and
                collaboration, we&apos;ve published all the data used by our site so
                anyone can inspect it and use it in their own creative ways.
              </p>
              <p>
                <ExternalLink href="https://github.com/cougargrades/publicdata">View Resources</ExternalLink>
              </p>
            </section>
            <section>
              <h3>
                By students. For students.{' '}
                <span className={styles.hearts}>&hearts;</span>
              </h3>
              <p>
                CougarGrades is open-source and developed by students past and
                present. Whether you&apos;re interested in contributing to or
                repurposing our code, check us out on Github!
              </p>
              <p>
                <ExternalLink href="https://github.com/orgs/cougargrades/people">View Collaborators</ExternalLink>
              </p>
            </section>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export const InternalLink = ({ href, children }) => <Link href={href} passHref><Button className={styles.linkbutton} color="primary" variant="contained">{children}</Button></Link>

export const ExternalLink = ({ href, children }) => <Link href={href} passHref><Button className={styles.linkbutton} color="primary" variant="contained" endIcon={<ArrowForwardIcon />}>{children}</Button></Link>
import React from 'react'
import Image from 'next/legacy/image'
import { useRecoilState } from 'recoil'
import Button from '@mui/material/Button'
import counts from '@cougargrades/publicdata/bundle/edu.uh.grade_distribution/counts.json'
import { BlogNotifications } from '../components/blog'
import { ExternalLink } from '../components/link'
import { searchInputAtom } from '../lib/recoil'
import slotmachine from '@/public/slotmachine.svg'
import wordcloud from '@/public/wordcloud.svg'

import styles from '@/styles/Homepage.module.scss'
import interactivity from '@/styles/interactivity.module.scss'

export default function Home() {
  const [searchInputRef, _] = useRecoilState(searchInputAtom)

  const numSections = `${(counts.num_sections / 1000).toFixed()}k`
  const numCourses = `${(counts.num_courses / 1000).toFixed(counts.num_courses >= 10_000 ? 0 : 1)}k`
  const numInstructors = `${(counts.num_instructors / 1000).toFixed(counts.num_instructors >= 10_000 ? 0 : 1)}k`
  const numSubjects = `${counts.num_subjects.toFixed(0)}`

  const focusSearchInput = () => {
    if(searchInputRef !== null) {
      searchInputRef.focus();
    }
  }

  return (
    <div className="new-container">
      <main className={styles.main}>
        <BlogNotifications />
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
                <div className={`${styles.stamp} ${styles.teal} ${styles.bignumber}`}>{numSections}</div> {/* 133k */}
                <span className={styles.stamp_caption}>Sections</span>
                <div className={`${styles.stamp} ${styles.gold}`}>{numCourses}</div> {/* 7.6k */}
                <span className={styles.stamp_caption}>Courses</span>
              </div>
              <br />
              <p>
                <Button color="primary" variant="contained" className={interactivity.hoverActive} onClick={focusSearchInput}>Search Courses</Button>
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
                <div className={`${styles.stamp} ${styles.blue}`}>{numInstructors}</div> {/* 6.2k */}
                <span className={styles.stamp_caption}>Instructors</span>
                <div className={`${styles.stamp} ${styles.orchid}`}>{numSubjects}</div> {/* 165 */}
                <span className={styles.stamp_caption}>Subjects</span>
              </div>
              <br />
              <p>
                <Button color="primary" variant="contained" className={interactivity.hoverActive} onClick={focusSearchInput}>Search Instructors</Button>
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
              <ExternalLink href="https://github.com/cougargrades/publicdata" openInNewTab>View Resources</ExternalLink>
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
              <ExternalLink href="https://github.com/orgs/cougargrades/people" openInNewTab>View Collaborators</ExternalLink>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

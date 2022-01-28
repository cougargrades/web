import Head from 'next/head'
import { ExternalLink } from '../components/link'
import { BlogNotifications } from '../components/blog'
import styles from '../styles/FAQ.module.scss'

export default function FrequentlyAskedQuestions() {
  return (
    <>
      <Head>
        <title>FAQ / CougarGrades.io</title>
        <meta name="description" content="Frequently Asked Questions" />
      </Head>
      <div className="new-container">
        <BlogNotifications />
        <h2>Frequently Asked Questions</h2>
        <p>These are some of the frequently asked questions that we receive.</p>
        <section className={styles.section}>
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
            This is to give UH time to finalize their grades and so we are not harassing their staff after or during any holidays. UH typically takes about a week to respond with the data, and sometimes even longer. Once we have the data from UH, adding the data to the site is a semi-automated process that takes about an 1-2 hours.
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
        </section>
      </div>
    </>
  );
}

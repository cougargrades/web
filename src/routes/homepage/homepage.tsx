import React, { Suspense } from 'react';
import { NavLink } from 'react-router-dom';

//import './button.scss';
import './stamps.scss';
import './homepage.scss';

// TODO: Remove when this is resolved: https://github.com/snowpackjs/snowpack/issues/3109
//import wordcloud from './wordcloud.svg';
//import slotmachine from './slotmachine.svg';
const wordcloud = '/_dist_/routes/homepage/wordcloud.svg';
const slotmachine = '/_dist_/routes/homepage/slotmachine.svg';

const Blog = React.lazy(() => import('~/components/blog/blog'));
const Footer = React.lazy(() => import('~/components/footer/footer'));

export default function Homepage() {
  return (
    <>
      <main>
        <r-grid columns="8">
          <r-cell span="row">
            <Suspense fallback={<div>Loading...</div>}>
              <Blog />
            </Suspense>
          </r-cell>
          <r-cell span="1-4" span-s="row">
            <section>
              <h2>Find every course.</h2>
              <p>
                Plan your degree with the knowledge to succeed. With data from
                Fall 2013 to present, we have information about every course and
                section taught at UH.
              </p>
              <div className="stamp-wrap">
                <div className="stamp teal bignumber">103k</div>
                <span>Sections</span>
                <div className="stamp gold">6.9k</div>
                <span>Courses</span>
              </div>
              <br />
              <p>
                <NavLink className="btn btn-adaptive" to="/courses">
                  Search Courses
                </NavLink>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <div
                title={'Top 48 most enrolled courses at UH.'}
                className="visaid slotmachine"
                style={{ backgroundImage: `url("${slotmachine}")` }}
              />
              <figcaption>Top 48 most enrolled courses at UH.</figcaption>
            </figure>
          </r-cell>
          <r-cell span="1-4" span-s="row">
            <section className="instructors">
              <h2>Know your instructors.</h2>
              <p>
                Gain insight by learning more about <em>who</em> your professors
                are. View previously taught courses and compare grades that
                their students received.
              </p>
              <div>
                <div className="stamp blue">5.4k</div>
                <span>Instructors</span>
                <div className="stamp orchid">149</div>
                <span>Departments</span>
              </div>
              <br />
              <p>
                <NavLink className="btn btn-adaptive" to="/instructors">
                  Search Instructors
                </NavLink>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <div
                title={
                  'Top 100 unique instructor lastnames, weighted by number of sections taught.'
                }
                className="visaid wordcloud"
                style={{ backgroundImage: `url("${wordcloud}")` }}
              />
              <figcaption>Top 100 unique instructor lastnames.</figcaption>
            </figure>
          </r-cell>
          <r-cell span="row" span-s="row">
            <section>
              <h3>Public data. Open data.</h3>
              <p>
                We use data sourced via the{' '}
                <em>Texas Public Information Act</em> and provided by the UH{' '}
                <a href="https://www.uh.edu/legal-affairs/general-counsel/texas-public-information/">
                  Office of the General Counsel
                </a>
                , among other official sources. To promote trust and
                collaboration, we've published all the data used by our site so
                anyone can inspect it and use it in their own creative ways.
              </p>
              <p>
                <a
                  className="btn btn-adaptive"
                  href="https://github.com/cougargrades/publicdata"
                >
                  View Resources &rarr;
                </a>
              </p>
            </section>
          </r-cell>
          <r-cell span="row" span-s="row">
            <section>
              <h3>
                By students. For students.{' '}
                <span className="hearts">&hearts;</span>
              </h3>
              <p>
                CougarGrades is open-source and developed by students past and
                present. Whether you're interested in contributing to or
                repurposing our code, check us out on Github!
              </p>
              <p>
                <a
                  className="btn btn-adaptive"
                  href="https://github.com/orgs/cougargrades/people"
                >
                  View Collaborators &rarr;
                </a>
              </p>
            </section>
          </r-cell>
        </r-grid>
      </main>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </>
  );
}

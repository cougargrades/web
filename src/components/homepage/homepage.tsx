import React, { Suspense } from 'react';
import { NavLink } from 'react-router-dom';

const Blog = React.lazy(() => import('../blog/blog'));
const Footer = React.lazy(() => import('../footer/footer'));

import './stamps.scss';
import './homepage.scss';

import wordcloud from './wordcloud.svg';
import slotmachine from './slotmachine.svg';

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
                <div className="stamp teal">103k</div>
                <span>Sections</span>
                <div className="stamp gold">6.9k</div>
                <span>Courses</span>
              </div>
              <br />
              <p>
                <NavLink className="button" to="/courses">
                  Search Courses
                </NavLink>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img
                title={'Top 48 most enrolled courses at UH.'}
                src={slotmachine}
                className="visaid"
                style={{ width: '100%' }}
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
                <NavLink className="button" to="/instructors">
                  Search Instructors
                </NavLink>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img
                title={
                  'Top 100 unique instructor lastnames, weighted by number of sections taught.'
                }
                src={wordcloud}
                className="visaid"
                style={{ width: '100%' }}
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
                  className="button"
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
                  className="button"
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

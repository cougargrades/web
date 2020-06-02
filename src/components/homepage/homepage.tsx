import React from 'react';

import { Blog } from '../blog/blog';

import './stamps.scss';
import './homepage.scss';
import './footer.scss';

import wordcloud from './wordcloud.svg';

export const Homepage: React.FC = () => {
  return (
    <>
      <main>
        <r-grid columns="8">
          <r-cell span="row">
            <Blog />
          </r-cell>
          <r-cell span="1-4" span-s="row">
            <section>
              <h2>Find every course.</h2>
              <p>
                The quick brown fox jumped over the lazy dog. The quick brown
                fox jumped over the lazy dog. The quick brown fox jumped over
                the lazy dog.
              </p>
              <div className="stamp-wrap">
                <div className="stamp teal">96k</div>
                <span>Sections</span>
                <div className="stamp gold">6.6k</div>
                <span>Courses</span>
              </div>
              <br />
              <p>
                <a className="button" href="#">
                  Search Courses
                </a>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img
                src="https://raw.githubusercontent.com/jesperlekland/react-native-svg-charts/master/screenshots/area-chart.png"
                style={{ width: '100%' }}
              />
            </figure>
          </r-cell>
          <r-cell span="1-4" span-s="row">
            <section>
              <h2>Know your instructors.</h2>
              <p>
                The quick brown fox jumped over the lazy dog. The quick brown
                fox jumped over the lazy dog. The quick brown fox jumped over
                the lazy dog.
              </p>
              <div>
                <div className="stamp blue">5k</div>
                <span>Instructors</span>
                <div className="stamp orchid">146</div>
                <span>Subjects</span>
              </div>
              <br />
              <p>
                <a className="button" href="#">
                  Search Instructors
                </a>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img
                title={
                  'Top 100 instructor lastnames, weighted by number of sections taught.'
                }
                src={wordcloud}
                style={{ width: '100%' }}
              />
            </figure>
          </r-cell>
        </r-grid>
      </main>
      <footer>
        <h6>@cougargrades/web</h6>
        <p>
          Version: <code>1.0.0</code>, Commit:{' '}
          <code>
            <a href="https://github.com/cougargrades/web">abcd123</a>
          </code>
          <br />
          Built: {new Date().toLocaleString()}
        </p>
        <p>
          <em>
            Not affiliated with the University of Houston. Data is sourced
            directly from the University of Houston.
          </em>
        </p>
      </footer>
    </>
  );
};

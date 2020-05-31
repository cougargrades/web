import React from 'react';

import { Blog } from '../blog/blog';

import './stamps.scss';
import './homepage.scss';
import './footer.scss';

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
                <div className="stamp teal">92k</div>
                <span>Sections</span>
                <div className="stamp gold">16k</div>
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
              <figcaption>An elephant at sunset</figcaption>
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
                <div className="stamp blue">29k</div>
                <span>Instructors</span>
                <div className="stamp orchid">130</div>
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
                src="https://raw.githubusercontent.com/jesperlekland/react-native-svg-charts/master/screenshots/line-chart.png"
                style={{ width: '100%' }}
              />
              <figcaption>An elephant at sunset</figcaption>
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

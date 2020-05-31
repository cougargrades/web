
import React from 'react'

import '@cougargrades/raster/raster2-react'
import './homepage.scss'

export const Homepage: React.FC = () => {
  return (
    <>
      <header className="hero">
        <main>
          <hgroup>
            <h1>CougarGrades.io</h1>
            <h3>Analyze grade distribution data</h3>
          </hgroup>
        </main>
      </header>
      <main>
        <r-grid columns="8">
          <r-cell span="1-4" span-s="row">
            <section>
              <h2>Find every course.</h2>
              <p>The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.</p>
              <div className="stamp-wrap">
                <div className="stamp teal">92k</div><span>Sections</span>
                <div className="stamp gold">16k</div><span>Courses</span>
              </div>
              <br />
              <p>
                <a className="button" href="#">Search Courses</a>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img src="https://raw.githubusercontent.com/jesperlekland/react-native-svg-charts/master/screenshots/area-chart.png" style={{ width: "100%" }} />
              <figcaption>An elephant at sunset</figcaption>
            </figure>
          </r-cell>
          <r-cell span="1-4" span-s="row">
            <section>
              <h2>Know your instructors.</h2>
              <p>The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog. The quick brown fox jumped over the lazy dog.</p>
              <div>
                <div className="stamp blue">29k</div><span>Instructors</span>
                <div className="stamp orchid">130</div><span>Subjects</span>
              </div>
              <br />
              <p>
                <a className="button" href="#">Search Instructors</a>
              </p>
            </section>
          </r-cell>
          <r-cell span="5.." span-s="row">
            <figure>
              <img src="https://raw.githubusercontent.com/jesperlekland/react-native-svg-charts/master/screenshots/line-chart.png" style={{ width: "100%" }} />
              <figcaption>An elephant at sunset</figcaption>
            </figure>
          </r-cell>
        </r-grid>
      </main>
    </>
  )
}
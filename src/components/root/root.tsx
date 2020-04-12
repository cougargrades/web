
import React from 'react'
import { BrowserRouter, Link, Switch, Route } from 'react-router-dom'

import { Blurb } from './blurb'
import { Brand } from './brand'

import { Homepage } from '../homepage/homepage'

import '@cougargrades/raster/raster2.css'
import './raster-overwrite.scss'
import './root.scss'

export const Root: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="menu">
        <ul className="menu">
          <li className="nav-home">
            <Link to="/"><Brand /></Link>
          </li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/instructors">Instructors</Link></li>
          <li><a className="disabled"><span role="img" aria-label="Lock">🔒</span> Groups</a></li>
          <li><a href="https://github.com/cougargrades/web/wiki/Feedback">Feedback</a></li>
          <li><a href="https://cougargrades.github.io/blog/">Updates</a></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <Switch>
        <Route path="/" exact>
          <Homepage />
        </Route>
        <Route path="/courses">
          {/* <Courses /> */}
        </Route>
        <Route path="/c/:name">
          {/* <IndividualCourse course={'none'} /> */}
        </Route>
        <Route path="/instructors">
          {/* <Instructors /> */}
        </Route>
        <Route path="/i/:fullName">
          {/* <IndividualInstructor /> */}
        </Route>
        <Route path="/api" exact>
          <Blurb>
            <p>Did you mean to go to <code><a href="/api/">/api/</a></code> (with the trailing slash)?</p>
          </Blurb>
        </Route>
        <Route path="/about">
          {/* <About /> */}
        </Route>
        <Route>
          <Blurb http404 />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
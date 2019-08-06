
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Brand  from './brand';
import Home from '../home/home';
import About from '../about/about';

import 'bootstrap/dist/css/bootstrap.css';

class Root extends Component {
    render() {
      return (
      <Router>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Brand />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
              <Nav.Link as={Link} to="/instructors" disabled={true}>Instructors</Nav.Link>
              <Nav.Link as={Link} to="/groups" disabled={true}>Groups</Nav.Link>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route path="/" exact component={Home} />
        <Route path="/courses" exact component={Home} />
        {/* <Route path="/instructors" exact component={Home} /> */}
        {/* <Route path="/groups" exact component={Home} /> */}
        <Route path="/about" component={About} />
      </Router>
      );
    }
}

/*

<Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about/">About</Link>
            </li>
            <li>
              <Link to="/users/">Users</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </div>
    </Router>

*/


/*

<nav class="navbar navbar-expand-lg navbar-light bg-light cg-navbar">
    {{#if index}}
        <a class="navbar-brand mb-0 h1" href="#">
            <img src="svg/baseline-school-24px.svg" width="24" height="24" alt="">
        </a>
    {{else}}
        <a class="navbar-brand mb-0 h1" href="#">CougarGrades.io</a>
    {{/if}}
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
        {{#if index}}
            <a class="nav-item nav-link active" href="{{& BASEURL }}/">Home <span class="sr-only">(current)</span></a>
        {{else}}
            <a class="nav-item nav-link" href="{{& BASEURL }}/">Home</a>
        {{/if}}
        {{#if courses}}
            <a class="nav-item nav-link active" href="{{& BASEURL }}/courses">Courses <span class="sr-only">(current)</span></a>
        {{else}}
            <a class="nav-item nav-link" href="{{& BASEURL }}/courses">Courses</a>
        {{/if}}
        <a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true"><i class="material-icons">lock</i>Instructors</a>
        <a class="nav-item nav-link disabled" href="#" tabindex="-1" aria-disabled="true"><i class="material-icons">lock</i>Groups</a>
        </div>
    </div>
</nav>

*/

export default Root;
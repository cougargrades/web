
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'bootstrap/dist/css/bootstrap.css';

import './root.scss';

import Brand  from './brand';
import Home from '../home/home';
import Courses from '../courses/courses';
import About from '../about/about';

import Info from '@material-ui/icons/Info';
import Lock from '@material-ui/icons/Lock';

class Root extends Component {
    render() {
      return (
      <Router>
        <Navbar bg="light" expand="lg" className="cg-navbar">
          <Navbar.Brand>
            <Brand />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
              <Nav.Link as={Link} to="/instructors" disabled={true}><Lock/>Instructors</Nav.Link>
              <Nav.Link as={Link} to="/groups" disabled={true}><Lock/>Groups</Nav.Link>
              
            </Nav>
            <Nav className="justify-content-end">
              <Nav.Link as={Link} to="/about"><Info/>About</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route path="/" exact component={Home} />
        <Route path="/courses" exact component={Courses} />
        {/* <Route path="/instructors" exact component={Home} /> */}
        {/* <Route path="/groups" exact component={Home} /> */}
        <Route path="/about" component={About} />
      </Router>
      );
    }
}

export default Root;
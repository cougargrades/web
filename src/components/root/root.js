
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'bootstrap/dist/css/bootstrap.css';

import './root.scss';

import Brand from './brand';
import NotFound from './notfound';
import Home from '../home/home';
import Courses from '../courses/courses';
import IndividualCourse from '../courses/individual';
import Instructors from '../instructors/instructors';
import IndividualInstructor from '../instructors/individual';
import About from '../about/about';

import Lock from '@material-ui/icons/Lock';

class Root extends Component {
    constructor() {
        super()

        // dark mode
        this.state = {
            colorScheme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
        }
        
        window.matchMedia('(prefers-color-scheme: dark)').addListener((event) => {
            this.setState({
                colorScheme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
            })
        });
    }
    render() {
        return (
        <Router>
            <Navbar bg={this.state.colorScheme} variant={this.state.colorScheme} expand="lg" className="cg-navbar">
                <Navbar.Brand>
                    <Brand />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse>
                    <Nav className="mr-auto navbar-nav">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                        <Nav.Link as={Link} to="/instructors">Instructors</Nav.Link>
                        <Nav.Link as={Link} to="/groups" disabled={true}><Lock/>Groups</Nav.Link>
                    </Nav>
                    <Nav className="navbar-nav justify-content-end">
                        <Nav.Link href="https://github.com/cougargrades/web/wiki/Feedback">Feedback</Nav.Link>
                        <Nav.Link href="https://cougargrades.github.io/blog/">Updates</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/" exact component={() => <Home />} />
                <Route path="/courses" component={({ location }) => <Courses location={location} />} />
                <Route path="/c/:name" component={({ location, match }) => <IndividualCourse course={decodeURI(match.params.name)} location={location} />} />
                <Route path="/instructors" component={({ location }) => <Instructors location={location}/>} />
                <Route path="/i/:name" component={( location, match ) => <IndividualInstructor fullName={location.match.params.name} location={location} /> } />
                {/* <Route path="/groups" exact component={Home} /> */}
                <Route path="/about" component={() => <About />} />
                <Route component={NotFound} />
            </Switch>
        </Router>
        );
    }
}

export default Root;
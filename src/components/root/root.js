
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
import About from '../about/about';

import Lock from '@material-ui/icons/Lock';

import firebase from 'firebase/app';
import 'firebase/firestore';

class Root extends Component {
    constructor() {
        super()
        // Initialize Cloud Firestore through Firebase
        firebase.initializeApp({
            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
        });

        firebase.firestore().enablePersistence().catch(function(err) {
            if (err.code === 'failed-precondition') {
                    // Multiple tabs open, persistence can only be enabled
                    // in one tab at a a time.
                    // ...
            } else if (err.code === 'unimplemented') {
                    // The current browser does not support all of the
                    // features required to enable persistence
                    // ...
            }
        })

        this.firebase = firebase;
        this.db = firebase.firestore();
    }
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
                        <Nav.Link as={Link} to="/instructors">Instructors</Nav.Link>
                        <Nav.Link as={Link} to="/groups" disabled={true}><Lock/>Groups</Nav.Link>
                    </Nav>
                    <Nav className="justify-content-end">
                        <Nav.Link href="https://github.com/cougargrades/web/wiki/Feedback">Feedback</Nav.Link>
                        <Nav.Link href="https://cougargrades.github.io/blog/">Updates</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Switch>
                <Route path="/" exact component={() => <Home firebase={this.firebase} db={this.db} />} />
                <Route path="/courses" component={({ location }) => <Courses location={location} firebase={this.firebase} db={this.db} />} />
                <Route path="/c/:name" component={({ location, match }) => <IndividualCourse firebase={this.firebase} db={this.db} course={decodeURI(match.params.name)} location={location} />} />
                <Route path="/instructors" component={({ location }) => <Instructors firebase={this.firebase} db={this.db} location={location}/>} />
                {/* <Route path="/groups" exact component={Home} /> */}
                <Route path="/about" component={() => <About firebase={this.firebase} db={this.db} />} />
                <Route component={NotFound} />
            </Switch>
        </Router>
        );
    }
}

export default Root;
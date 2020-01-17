
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import formatDistance from 'date-fns/formatDistance';

import Util from '../_common/util';

import './home.scss';

class Home extends Component {
    state = {
        latestTerm: '...',
        blog: [],
        colorScheme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'
    }

    /**
     * Background styling is defined here because external CSS
     * will persist even when Home is switched to another component.
     * 
     * This background color is unset to `null` in componentWillUnmount
     */
    styles = {
        body: {
            backgroundColor: '#fff9d9'
        }
    }

    componentDidMount() {
        (async () => {
            // get blog post data
            let res = await fetch('https://cougargrades.github.io/blog/atom.xml')
            let data = await res.text()
            let parser = new DOMParser()
            let xml = parser.parseFromString(data, 'text/xml')
            let entries = []
            for(const entry of xml.querySelectorAll('entry')) {
                entries.push({
                    title: entry.querySelector('title').textContent,
                    link: entry.querySelector('link').getAttribute('href'),
                    updated: new Date(entry.querySelector('updated').textContent),
                    id: entry.querySelector('id').textContent,
                    content: entry.querySelector('content').innerHTML
                })
            }
            entries.sort((a, b) => {
                return a.updated < b.updated
            })
            this.setState({
                blog: JSON.parse(JSON.stringify(entries))
            })
        })();
        let db = this.props.db; // Firestore reference passed successfully without creating another instance
        for(let i in this.styles.body){
            document.body.style[i] = this.styles.body[i];
        }

        var local = null;
        if(localStorage.getItem('catalog_meta')) {
            local = JSON.parse(localStorage.getItem('catalog_meta'))
        }

        // if lastUpdated is younger than 5 days, use the local copy
        if(local && local.latestTerm && (new Date() - new Date(local.__lastUpdated)) < (1000 * 60 * 60 * 24 * 5) ) {
            this.setState({
                latestTerm: Util.termString(local.latestTerm)
            })
        }
        else {
            db.collection('catalog_meta').doc('meta').get().then((doc) => {
                if(doc.exists) {
                    localStorage.setItem('catalog_meta', JSON.stringify(Object.assign({__lastUpdated: new Date()}, doc.data())));
                    this.setState({
                        latestTerm: Util.termString(doc.data().latestTerm)
                    })
                }
            })
        }
    }

    componentWillUnmount() {
        for(let i in this.styles.body){
            document.body.style[i] = null;
        }
    }

    render() {
        return (
            <Container>
                <Jumbotron className="hero">
                    <h1 className="cg-hero">CougarGrades.io</h1>
                    <p className="lead">Analyze grade distribution data for any past University of Houston course</p>
                    <hr className="my-4" />
                    <p><em>Not affiliated with the University of Houston. Data is sourced directly from the University of Houston.</em></p>
                    <p><em>Latest semester available: <span id="latestTerm">{this.state.latestTerm}</span></em></p>
                    <Button variant="primary" className="btn-cg" as={Link} to="/courses">Search Courses</Button>
                    <Button variant="primary" className="btn-cg" as={Link} to="/instructors">Search Instructors</Button>
                    <Button href="https://github.com/search?utf8=%E2%9C%93&q=FOIA-IR+user%3Acougargrades&type=Repositories&ref=advsearch&l=&l=" variant="primary" className="btn-cg">Spreadsheets</Button>
                </Jumbotron>
                <Jumbotron>
                    <div className="updates">
                        <h5>Developer updates</h5>
                        <ul>
                            {this.state.blog.map(entry => {
                                return (
                                    <li key={entry.id}><a href={entry.link}>{entry.title}</a>, <span>{formatDistance(new Date(entry.updated), new Date(), { addSuffix: true })}</span></li>
                                )
                            })}
                        </ul>
                    </div>
                </Jumbotron>
            </Container>
        );
    }
}

export default Home;

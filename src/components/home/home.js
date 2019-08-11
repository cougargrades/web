
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import Util from '../_common/util';

import './home.scss';

class Home extends Component {
    state = {
        latestTerm: '...'
    }

    styles = {
        body: {
            backgroundColor: '#FFF9D9'
        }
    }

    componentDidMount() {
        let self = this;
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
            self.setState({
                latestTerm: Util.termString(local.latestTerm)
            })
        }
        else {
            db.collection('catalog_meta').doc('meta').get().then(function(doc) {
                if(doc.exists) {
                    localStorage.setItem('catalog_meta', JSON.stringify(Object.assign({__lastUpdated: new Date()}, doc.data())));
                    self.setState({
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
                <Jumbotron>
                    <h1 className="cg-hero">CougarGrades.io <sup>&beta;eta</sup></h1>
                    <p className="lead">Analyze grade distribution data for any past University of Houston course</p>
                    <hr className="my-4" />
                    <p><em>Not affiliated with the University of Houston.</em></p>
                    <p><em>Latest data available: <span id="latestTerm">{this.state.latestTerm}</span></em></p>
                    <Button variant="primary" className="btn-cg" as={Link} to="/courses">Learn more</Button>
                </Jumbotron>
            </Container>
        );
    }
}

export default Home;

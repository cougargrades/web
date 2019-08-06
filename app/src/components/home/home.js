
import React, { Component } from 'react';

import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';

import './home.scss';

class Home extends Component {

    styles = {
        body: {
            backgroundColor: '#FFF9D9'
        }
    }

    componentWillMount() {
        for(let i in this.styles.body){
            document.body.style[i] = this.styles.body[i];
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
                    <h1 className="cg-hero">CougarGrades.io <sup>&beta;</sup></h1>
                    <p className="lead">Analyze grade distribution data for any past University of Houston course</p>
                    <hr className="my-4" />
                    <p><em>Not affiliated with the University of Houston.</em></p>
                    <p><em>Latest data available: <span id="latest_data">Spring 2019</span></em></p>
                    <Button variant="primary" className="btn-cg" as={Link} to="/courses">Learn more</Button>
                </Jumbotron>
            </Container>
        );
    }
}

export default Home;

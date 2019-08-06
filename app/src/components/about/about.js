
import React, { Component } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './about.scss';

class About extends Component {
    render() {
        return (
            <Container className="about">
                <Row>
                    <Col sm={3}>
                        <picture className="shasta">
                            <source type="image/webp" srcSet="https://cougargrades.github.io/assets/uhp718cc_948x948.webp"/>
                            <source type="image/jpeg" srcSet="https://cougargrades.github.io/assets/uhp718cc_948x948.jpg"/>
                            <img src="https://cougargrades.github.io/assets/uhp718cc_948x948.jpg" title="Shasta III relaxing outside of the University Center. Special Collections, University of Houston Libraries. University of Houston Digital Library. Web. August 6, 2019. https://digital.lib.uh.edu/collection/p15195coll6/item/540."/>
                        </picture>
                    </Col>
                    <Col sm={9}>
                        <h3>About</h3>
                        <hr/>
                        <p>
                            Developed by Austin Jackson with contributions from Shay Arratia.<br/>
                            Powered by Firebase, React, Sass, Bootstrap, AnimeJS.
                        </p>
                        <p>Front-end code, database processor, FOIA data, and more, published on Github.</p>
                        <Button href="https://github.com/cougargrades" variant="primary">Github</Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default About;
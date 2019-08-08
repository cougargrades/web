
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
                            <img src="https://cougargrades.github.io/assets/uhp718cc_948x948.jpg" alt="Shasta III" title="Shasta III relaxing outside of the University Center. Special Collections, University of Houston Libraries. University of Houston Digital Library. Web. August 6, 2019. https://digital.lib.uh.edu/collection/p15195coll6/item/540."/>
                        </picture>
                    </Col>
                    <Col sm={9}>
                        <h2>CougarGrades <sup className="beta">&beta;eta</sup></h2>
                        <hr />
                        <p className="lead">
                            Developed by Austin Jackson<br/>
                            Contributions from Shay Arratia
                            </p>
                        <p><em>Version: {process.env.REACT_APP_VERSION}, Commit: {process.env.REACT_APP_GIT_SHA}</em></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <h4>Resources</h4>
                    <p>Front-end code, database processor, <abbr title="Freedom of Information Act">FOIA</abbr> data, and more, are published on Github.</p>
                    <p><Button href="https://github.com/cougargrades" variant="primary">Github</Button></p>

                    <h4>Acknowledgement</h4>
                    <p>Some other great projects we found inspiration in:</p>
                    <ul>
                        <li>anex.us/grades/ (author unknown)</li>
                        <li>AggieSchduler (<a href="https://github.com/jake-leland">@jake-leland</a>)</li>
                        <li>Good-Bull-Schedules (<a href="https://github.com/SaltyQuetzals">@SaltyQuetzals</a>)</li>
                    </ul>

                    <h4>Technologies</h4>
                    <p>CougarGrades is powered by Google Firebase, ReactJS, Bootstrap, Sass, Google Charts API, AnimeJS, and more.</p>

                    <h4>Authors</h4>
                    <p>You can visit more of our work on our websites.</p>
                    <p>
                        <Button href="https://austinj.net" variant="dark">Austin Jackson</Button>&nbsp;
                        <Button href="#" variant="dark" disabled>Shay Arratia</Button>
                    </p>

                    <h5>Notice of Non-Affiliation and Disclaimer</h5>
                    <p>
                        <em>
                        We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with University of Houston, or any of its subsidiaries or its affiliates.
                        The official University of Houston website can be found at http://www.uh.edu.
                        The name “University of Houston” as well as related names, marks, emblems and images are registered trademarks of their respective owners.
                        </em>
                    </p>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default About;
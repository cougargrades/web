
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
                        <p><em>
                            Version: {process.env.REACT_APP_VERSION}, Commit: <a href={`https://github.com/cougargrades/web/commit/${process.env.REACT_APP_GIT_SHA}`}>{process.env.REACT_APP_GIT_SHA}</a> <br/>
                            Build date: {new Date(process.env.REACT_APP_BUILD_DATE).toLocaleDateString()}
                        </em></p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <h4>Resources</h4>
                    <p>Front-end code, database processor, <abbr title="Freedom of Information Act">FOIA</abbr> data, public HTTP API, and more, are published on Github.</p>
                    <p><Button href="https://github.com/cougargrades" variant="primary">Github</Button>&nbsp;<Button href="https://cougargrades.github.io/api/" variant="primary">Public API</Button></p>

                    <h4>Where is the grade data from?</h4>
                    <p>
                        The grade distribution data used by CougarGrades was acquired through use of 
                        the <em>Freedom of Information Act</em> and the <em>Texas Public Information Act</em> directly 
                        from the University of Houston <a href="http://www.uh.edu/legal-affairs/general-counsel/texas-public-information/">Office of the General Counsel</a>.
                    </p>
                    <p>
                        You can access the original documents we were provided and use the data your own way by checking out our published repositories on Github.
                    </p>
                    <p><Button href="https://github.com/search?utf8=%E2%9C%93&q=FOIA-IR+user%3Acougargrades&type=Repositories&ref=advsearch&l=&l=" variant="dark">FOIA Data</Button></p>

                    <h5>Acknowledgement</h5>
                    <p>Some other great projects we found inspiration in:</p>
                    <ul>
                        <li>anex.us/grades/ (author unknown)</li>
                        <li>AggieScheduler (<a href="https://github.com/jake-leland">@jake-leland</a>)</li>
                        <li>Good-Bull-Schedules (<a href="https://github.com/SaltyQuetzals">@SaltyQuetzals</a>)</li>
                    </ul>

                    <h5>Technologies</h5>
                    <p>CougarGrades is powered by Google Firebase, ReactJS, Bootstrap, Sass, Google Charts API, AnimeJS, and more.</p>

                    <h5>Authors</h5>
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


import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import './updates.scss';

class Updates extends Component {
    render() {
        return (
            <Container className="updates">
                <h2>Developer updates</h2>
                <hr />
                <Card>
                    <Card.Body>
                        <Card.Title>Site update</Card.Title>
                        <Card.Subtitle className="text-muted">Sunday, December 15, 2019</Card.Subtitle>
                        <Card.Text>
                            Some of the text and layout of information on the website was adjusted.
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>New data</Card.Title>
                        <Card.Subtitle className="text-muted">Tuesday, September 24, 2019</Card.Subtitle>
                        <Card.Text>
                            Summer 2019 data was received from the University of Houston and was successfully added to the database. Some downtime may have been experienced during that period.
                        </Card.Text>
                        <Card.Link href="https://github.com/cougargrades/FOIA-IR06046">Source data</Card.Link>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body>
                        <Card.Title>Database upgrades</Card.Title>
                        <Card.Subtitle className="text-muted">Tuesday, September 10, 2019</Card.Subtitle>
                        <Card.Text>
                            Database upgrades have been completed. Site functionality may have been affected during the upload time into the hosted database. For more information, see the cougargrades importer.
                        </Card.Text>
                        <Card.Link href="https://github.com/cougargrades/importer">@cougargrades/importer</Card.Link>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}

export default Updates;

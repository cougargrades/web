import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import InstructorResultCard from './InstructorResultCard'

import './instructors.scss';

const james_west = {
    GPA: {
        average: 2.3685,
        maximum: 3.257,
        median: 2.3445,
        minimum: 1.727,
        range: 1.53,
        standardDeviation: 0.31841 // 0.31841
    },
    courses_count: 7,
    departments: {
        MATH: 7
    },
    firstName: 'James David',
    fullName: 'James David West',
    lastName: 'West',
    sections_count: 51
}

class Instructors extends Component {
    render() {
        return (
            <Container>
                <div>
                    <h2>Instructor search</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dignissim ac urna nec sodales. Proin luctus velit a tincidunt ultrices. </p>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Subtitle className="text-muted">Card Subtitle</Card.Subtitle>
                            <Card.Link href="#">Card Link</Card.Link>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Title>Card Title</Card.Title>
                            <Card.Subtitle className="text-muted">Card Subtitle</Card.Subtitle>
                            <Card.Link href="#">Card Link</Card.Link>
                        </Card.Body>
                    </Card>
                    <hr />
                    <InstructorResultCard instructor={james_west}/>
                </div>
            </Container>
        )
    }
}

export default Instructors;
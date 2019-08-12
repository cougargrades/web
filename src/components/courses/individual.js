import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import ArrowBack from '@material-ui/icons/ArrowBack';

import './courses.scss';
import './individual.scss';

import CGCourseContent from './results/CGCourseContent';

class IndividualCourse extends Component {
    constructor() {
        super()
        this.state = {
            course: {
                description: ""
            }
        }
    }

    handleLoaded(course) {
        console.log(course)
        if(course) {
            this.setState({
                course: JSON.parse(JSON.stringify(course))
            })
        }
    }

    render() {
        return (
        <Container>
            <div>
                <h3>{this.props.course} <small className="text-muted">{this.state.course.description}</small></h3>
                {this.props.history.length > 2 ? <p className="back-to-search"><Button onClick={() => {this.props.history.goBack()}}><ArrowBack/><span>Go Back</span></Button></p> : <></>}
                <CGCourseContent course={this.props.course} onLoaded={(course) => this.handleLoaded(course)} className="text-center" parent="individual" firebase={this.props.firebase} db={this.props.db} />
            </div>
        </Container>
        );
    }
}

export default IndividualCourse;
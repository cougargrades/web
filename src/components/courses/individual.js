import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom';

import ArrowBack from '@material-ui/icons/ArrowBack';

import './courses.scss';
import './individual.scss';

import CGCourseContent from './results/CGCourseContent';

export default class IndividualCourse extends Component {
    constructor(props) {
        super()
        this.state = {
            course: {
                description: ""
            },
            selection: []
        }
        if(props.location && props.location.state && props.location.state.selection && props.location.state.selection.length > 0) {
            //console.log('passed into /c/', props.location.state.selection)
            this.state.selection = JSON.parse(JSON.stringify(props.location.state.selection));
        }
    }

    handleLoaded(course) {
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
                {this.state.selection && this.state.selection.length > 0 ? <p className="back-to-search"><Button as={Link} to={{
                    pathname: '/courses',
                    state: { selection: JSON.parse(JSON.stringify(this.state.selection)) }
                }}><ArrowBack/><span>Go Back</span></Button></p> : <></>}
                <CGCourseContent course={this.props.course} onLoaded={(course) => this.handleLoaded(course)} className="text-center" parent="individual" />
            </div>
        </Container>
        );
    }
}

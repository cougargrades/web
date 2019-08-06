import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';

import './courses.scss';

import CGSearchForm from './form/CGSearchForm.jsx';
import CGCourseResults from './results/CGCourseResults.jsx';

class Courses extends Component {
    constructor(props) {
        super(props);
        this.state = {
        selection: []
        };
    }

    handleQuery(selection) {
        console.log('query handled: ',selection)
        this.setState({
        selection: selection.slice()
        })
    }

    render() {
        return (
        <Container>
            <CGSearchForm onQuery={(val) => this.handleQuery(val)}/>
            <CGCourseResults selection={this.state.selection} />
        </Container>
        );
    }
}

export default Courses;
import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import PropTypes from 'prop-types';

import { Chart } from 'react-google-charts';

import CGCourseHeader from './CGCourseHeader.jsx';
import CGTableData from './CGTableData.jsx';
import { Course, SQLData } from './CGMiscClasses.jsx';
import CGCourseCollapsibleContent from './CGCourseCollapsibleContent.jsx';

function nameToId(course) {
    // base64 of course name
    let id = btoa(course)
    id = id.substring(0,id.length-1)
    return id.slice()
}

class CGCourseCollapsible extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: nameToId(this.props.course),
            heading: `CGCourseCollapsible_heading_${nameToId(this.props.course)}`,
            content: `CGCourseCollapsible_content_${nameToId(this.props.course)}`,
            open: true,
            loading: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.open != nextState.open || this.state.loading != nextState.loading);
    }

    handleClick() {
        if(!this.state.loading) {
            this.setState({open: !this.state.open})
        }
    }

    handleLoaded() {
        this.setState({loading: !this.state.loading})
    }

    render() {
        return (
        <div className="card">
            <div className="card-header" id={this.state.heading} aria-controls={this.state.content} aria-expanded={this.state.open} onClick={() => this.handleClick()}>
                <h5 className="mb-0 cg-card-title">
                    <CGCourseHeader course={this.props.course} />
                </h5>
                {this.state.loading ? <span className="spinner three-quarters-loader">🔄</span> : null}
            </div>
            <Collapse in={this.state.open}>
                <div>
                <div id={this.state.content} className="card-body">
                    <CGCourseCollapsibleContent course={this.props.course} onLoaded={() => this.handleLoaded()}/>
                </div>
                </div>
            </Collapse>
        </div>
        );
    }
}


CGCourseCollapsible.propTypes = {
    course: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired
};

export default CGCourseCollapsible;

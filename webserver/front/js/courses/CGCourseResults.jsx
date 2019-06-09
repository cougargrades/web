import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card';

import PropTypes from 'prop-types';

import CGCourseCollapsible from './CGCourseCollapsible.jsx';
import CGCourseHeader from './CGCourseHeader.jsx';
import { definitions } from './IconKey.js';
import { Course, SQLData } from './CGMiscClasses.jsx';

class CGCourseResults extends React.Component {
    constructor(props) {
        super(props);
    }

    nameToId(course) {
        // base64 of course name
        let id = btoa(course)
        id = id.substring(0,id.length-1)
        return id.slice()
    }

    render() {
        return (
        <div className="cg-content">
            <div className="accordion" id="accordionExample">
                {this.props.selection.map(elem => {
                    return (
                        <CGCourseCollapsible key={this.nameToId(elem)} course={elem} parent="#accordionExample" />
                    )
                })}
                {/* Testing icons */}
                {/* {Object.keys(definitions).filter(t => definitions[t] !== null).map(elem => {
                    return (
                        <CGCourseCollapsible key={this.nameToId(elem)} course={elem} parent="#accordionExample" />
                    )
                })} */}
            </div>
        </div>
        );
    }
}

CGCourseResults.propTypes = {
    selection: PropTypes.array.isRequired
};

export default CGCourseResults;

import React from 'react';
import PropTypes from 'prop-types';

import { definitions } from './IconKey.js';

class CGCourseHeader extends React.Component{
    constructor(props) {
        super(props)
        this.dept = props.course.toUpperCase().split(' ')[0]
    }
    render() {
        if(definitions[this.dept] === null || definitions[this.dept] === undefined) {
            return (
                <>
                <i className="material-icons cg-icon">class</i>
                {this.props.course}
                </>
            )
        }
        else if(typeof definitions[this.dept] === 'string') {
            return (
                <>
                <i className="material-icons cg-icon">{definitions[this.dept]}</i>
                {this.props.course}
                </>
            )
        }
        else if(typeof definitions[this.dept] === 'object') {
            if(definitions[this.dept]['src']) {
                return (
                    <>
                    <img className="cg-icon" alt="icon" src={definitions[this.dept]['src']} />
                    {this.props.course}
                    </>
                )
            }
        }
    }
    get definitions() {
        return definitions
    }
}

CGCourseHeader.propTypes = {
    course: PropTypes.string.isRequired
};

export default CGCourseHeader


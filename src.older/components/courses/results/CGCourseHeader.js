import React from 'react';
import PropTypes from 'prop-types';

import Class from '@material-ui/icons/Class';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

import { IconMapper, definitions } from './IconKey';

class CGCourseHeader extends React.Component{
    constructor(props) {
        super(props)
        this.dept = props.courseName.toUpperCase().split(' ')[0];
    }
    render() {
        if(this.props.course && this.props.course._noresult) {
            // if empty object
            return (
                <>
                <ErrorOutline className="cg-icon"/>
                {this.props.courseName}
                </>
            )
        }
        else if(definitions[this.dept] && definitions[this.dept]['muiName'] === "SvgIcon") {
            return (
                <>
                <IconMapper dept={this.dept}/>
                {this.props.courseName}
                {this.props.course && this.props.course.description ? `: ${this.props.course.description}` : ''}
                </>
            )
        }
        else if(definitions[this.dept] && typeof definitions[this.dept] === 'object' && definitions[this.dept]['src']) {
            return (
                <>
                <img className="cg-icon" alt="icon" src={definitions[this.dept]['src']} />
                {this.props.courseName}
                {this.props.course && this.props.course.description ? `: ${this.props.course.description}` : ''}
                </>
            )
        }
        else {
            return (
                <>
                <Class />
                {this.props.courseName}
                {this.props.course && this.props.course.description ? `: ${this.props.course.description}` : ''}
                </>
            )
        }
    }
}

CGCourseHeader.propTypes = {
    courseName: PropTypes.string.isRequired
};

export default CGCourseHeader


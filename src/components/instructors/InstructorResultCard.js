import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import GPABadge from './GPABadge';

import Subjects from '../_common/subjects.json';
import Util from '../_common/util';

import './InstructorResultCard.scss';

/**
 * Raquel Andreina de la Trinidad Abend Van Dalen
 * Mathematics, Biology
 */

class InstructorResultCard extends Component {
    constructor(props) {
        super(props)

        this.style = {
            opacity: 0.0,
            transform: 'translateY(25px)'
        }
    }

    subject_str() {
        let depts = Object.keys(this.props.instructor.departments)
        let str = ''
        for(let i = 0; i < depts.length; i++) {
            if(i === (depts.length - 1)) {
                str += Subjects[depts[i]]
            }
            else {
                str += `${str += Subjects[depts[i]]}, `
            }
        }
        return str ? str : 'Instructor';
    }

    render() {
        let fN = this.props.instructor.fullName.length;

        return (
            <Link className="instructor-link" to={{
                pathname: `/i/${this.props.instructor.fullName}`
             }}>
            <div className="instructor-result-card" style={this.style}>
                <div className="body-wrap">
                    <div className="body">
                        <GPABadge value={this.props.instructor.GPA.average} stddev={this.props.instructor.GPA.standardDeviation} />
                        <div className={`name h5 ${fN >= 35 ? 's35' : ''}`}>{this.props.instructor.fullName}</div>
                        <div className="subjects text-muted">{Util.subject_str(this.props.instructor.departments)}</div>
                        <div className="counts">
                            <span>{this.props.instructor.courses_count} courses &bull; {this.props.instructor.sections_count} sections</span>
                        </div>
                    </div>
                </div>
            </div>
            </Link>
        )
    }
}

InstructorResultCard.propTypes = {
    instructor: PropTypes.object.isRequired
};

export default InstructorResultCard;
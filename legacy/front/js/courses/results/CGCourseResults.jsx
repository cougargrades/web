import React from 'react';
import PropTypes from 'prop-types';

import CGCourseItem from './CGCourseItem.jsx';
import { nameToId } from './MiscClasses.js';

class CGCourseResults extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div className="cg-content">
            <div className="accordion" id="accordion">
                {this.props.selection.map(elem => {
                    return (
                        <CGCourseItem key={nameToId(elem)} course={elem} parent="#accordion" />
                    )
                })}
            </div>
        </div>
        );
    }
}

CGCourseResults.propTypes = {
    selection: PropTypes.array.isRequired
};

export default CGCourseResults;

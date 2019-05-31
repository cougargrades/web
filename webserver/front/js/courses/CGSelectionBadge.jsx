import React from 'react';

import PropTypes from 'prop-types';

class CGSelectionBadge extends React.Component {
    constructor(props) {
        super(props);

    }

    // Prevents the re-rendering of badges that were already drawn
    shouldComponentUpdate(nextProps, nextState) { 
        if (nextProps.course === this.props.course) return false;
    
        return true;
    }    
    render() {
        console.log(this.props)
        return (
            <span key={this.props.course} className="badge badge-secondary">
                {this.props.course}
                <i key={this.props.course} className="material-icons" onClick={() => this.props.onClick()}>cancel</i>
            </span>
        )
    }
}

CGSelectionBadge.propTypes = {
    course: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};


export default CGSelectionBadge;
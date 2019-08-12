import React from 'react';

import PropTypes from 'prop-types';

import anime from 'animejs/lib/anime.es.js';

import Cancel from '@material-ui/icons/Cancel';

class CGSelectionBadge extends React.Component {

    // Prevents the re-rendering of badges that were already drawn
    shouldComponentUpdate(nextProps, nextState) { 
        if (nextProps.course === this.props.course) return false;
    
        return true;
    }
    componentDidMount() {
        anime({
            targets: 'span.badge',
            translateY: 0,
            opacity: 1
        });
    }
    render() {
        return (
            <span key={this.props.course} className="badge badge-secondary" style={{transform: 'translateY(50px) rotateX(0deg)', opacity: 0}}>
                {this.props.course}
                <Cancel key={this.props.course} onClick={() => this.props.onClick()}/>
            </span>
        );
    }
}

CGSelectionBadge.propTypes = {
    course: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};


export default CGSelectionBadge;
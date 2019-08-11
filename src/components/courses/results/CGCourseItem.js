import React from 'react';
import PropTypes from 'prop-types';

import Collapse from 'react-bootstrap/Collapse'

import anime from 'animejs/lib/anime.es.js';

import CircularProgress from '@material-ui/core/CircularProgress';

import CGCourseHeader from './CGCourseHeader';
import CGCourseContent from './CGCourseContent';

class CGCourseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: btoa(this.props.course),
            heading: `CGCourseCollapsible_heading_${btoa(this.props.course)}`,
            content: `CGCourseCollapsible_content_${btoa(this.props.course)}`,
            open: true,
            loading: true
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.open !== nextState.open || this.state.loading !== nextState.loading);
    }

    handleClick() {
        if(this.state.open) {
            // Closing animation
            anime.timeline()
            .add({
                targets: `#${this.state.content}`,
                duration: 450, // ms
                easing: 'easeInOutSine',
                translateY: -(document.getElementById(this.state.content).clientHeight) // px
            })
            .finished.then(() => {
                this.setState({open: !this.state.open})
            })
        }
        else {
            // Opening animation
            this.setState({open: !this.state.open}, () => {
                anime.timeline()
                .add({
                    targets: `#${this.state.content}`,
                    duration: 450, // ms
                    easing: 'easeInOutSine',
                    translateY: 0 // px
                })
            })
        }
    }

    handleLoaded() {
        this.setState({loading: !this.state.loading})
    }

    render() {
        return (
        <div className="card" ref={this.ref}>
            <div className={`card-header ${this.state.open ? 'open' : 'closed'}`} id={this.state.heading} onClick={() => this.handleClick()}>
                <h5 className="mb-0 cg-card-title">
                    <CGCourseHeader course={this.props.course} />
                </h5>
                {(() => {
                    if(this.state.loading) return <CircularProgress className="rhs" variant="indeterminate" size={20} color="secondary" />
                    return this.state.open ? <i className="material-icons rhs">arrow_drop_down</i> : <i className="material-icons rhs">arrow_left</i>
                })()}
            </div>
            <Collapse in={this.state.open} timeout={300}>
                <div>
                <div id={this.state.content} className="card-body">
                    <CGCourseContent course={this.props.course} onLoaded={() => this.handleLoaded()} firebase={this.props.firebase} db={this.props.db} />
                </div>
                </div>
            </Collapse>
        </div>
        );
    }
}


CGCourseItem.propTypes = {
    course: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired
};

export default CGCourseItem;

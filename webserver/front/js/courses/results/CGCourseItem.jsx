import React from 'react';
import PropTypes from 'prop-types';

import Collapse from 'react-bootstrap/Collapse'

import CGCourseHeader from './CGCourseHeader.jsx';
import { nameToId } from './MiscClasses.js';
import CGCourseContent from './CGCourseContent.jsx';

class CGCourseItem extends React.Component {
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
        var self = this
        console.log(this.state.open)
        if(this.state.open) {
            anime.timeline()
            .add({
                targets: `#${this.state.heading}`,
                duration: 1000,
                perspective: 300, // px
                rotateX: 10, // deg
                zIndex: 100,
                boxShadow: '0px 2px 3px rgba(0,0,0,0.25)'
            })
            .add({
                targets: `#${this.state.content}`,
                duration: 800,
                translateY: -(document.getElementById(this.state.content).clientHeight) // px
            }, '-=900')
            .add({
                targets: `#${this.state.heading}`,
                duration: 800,
                perspective: 300, // px
                rotateX: 0, // deg
                boxShadow: '0 0 0 rgba(0,0,0,0)'
            }, '-=300')
            .finished.then(function(){
                self.setState({open: !self.state.open})
            })
        }
        else {
            self.setState({open: !self.state.open}, function(){
                anime.timeline()
                .add({
                    targets: `#${this.state.heading}`,
                    duration: 1000,
                    perspective: 300, // px
                    rotateX: 10, // deg
                    zIndex: 100,
                    boxShadow: '0px 2px 3px rgba(0,0,0,0.25)'
                })
                .add({
                    targets: `#${this.state.content}`,
                    duration: 800,
                    translateY: 0 // px
                }, '-=900')
                .add({
                    targets: `#${this.state.heading}`,
                    duration: 800,
                    perspective: 300, // px
                    rotateX: 0, // deg
                    boxShadow: '0 0 0 rgba(0,0,0,0)'
                }, '-=300')
                .finished.then(function(){
                    //
                })
            })
        }

        // if(!this.state.loading) {
        //     this.setState({open: !this.state.open})
        // }
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
                    if(this.state.loading) return <span className="rhs spinner three-quarters-loader">🔄</span>
                    return this.state.open ? <i className="material-icons rhs">unfold_less</i> : <i className="material-icons rhs">unfold_more</i>
                })()}
            </div>
            <Collapse in={this.state.open} timeout={300}>
                <div>
                <div id={this.state.content} className="card-body">
                    <CGCourseContent course={this.props.course} onLoaded={() => this.handleLoaded()}/>
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

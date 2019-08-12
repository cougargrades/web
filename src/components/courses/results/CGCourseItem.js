import React from 'react';
import PropTypes from 'prop-types';

import Collapse from 'react-bootstrap/Collapse'

import anime from 'animejs/lib/anime.es.js';

import CircularProgress from '@material-ui/core/CircularProgress';

import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import LinkIcon from '@material-ui/icons/Link';

import CGCourseHeader from './CGCourseHeader';
import CGCourseContent from './CGCourseContent';

import { Link } from 'react-router-dom';

class CGCourseItem extends React.Component {
    constructor(props) {
        super(props);
        //console.log('passed into cgcourseitem ', props.selection)
        this.state = {
            id: btoa(props.course),
            heading: `CGCourseCollapsible_heading_${btoa(props.course)}`,
            content: `CGCourseCollapsible_content_${btoa(props.course)}`,
            open: true,
            loading: true,
            course: {}
        };
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

    handleLoaded(course) {
        this.setState({
            loading: !this.state.loading,
            course: (course === null ? {_noresult: true} : course)
        })
    }

    render() {
        return (
        <div className="card" ref={this.ref}>
            <div className={`card-header ${this.state.open ? 'open' : 'closed'}`} id={this.state.heading} onClick={() => this.handleClick()}>
                <h5 className="mb-0 cg-card-title">
                    <CGCourseHeader courseName={this.props.course} course={this.state.course} />
                </h5>
                {(() => {
                    if(this.state.loading) return <CircularProgress className="rhs" variant="indeterminate" size={20} color="secondary" />
                    return (<>
                        {this.state.open ? <ArrowDropDown className="rhs"/> : <ArrowLeft className="rhs"/>}
                        {this.state.course && this.state.course._noresult ? <></> : <Link to={{
                            pathname: `/c/${encodeURI(this.props.course)}`,
                            state: { selection: JSON.parse(JSON.stringify(this.props.selection)) }
                         }}><LinkIcon className="rhs"/></Link>}
                    </>);
                })()}
            </div>
            <Collapse in={this.state.open} timeout={300}>
                <div>
                <div id={this.state.content} className="card-body">
                    <CGCourseContent course={this.props.course} onLoaded={(course) => this.handleLoaded(course)} parent="collapsible" firebase={this.props.firebase} db={this.props.db} />
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

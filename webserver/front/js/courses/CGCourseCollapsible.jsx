import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import PropTypes from 'prop-types';

import CGCourseHeader from './CGCourseHeader.jsx';

function nameToId(course) {
    // base64 of course name
    let id = btoa(course)
    id = id.substring(0,id.length-1)
    return id.slice()
}


class CGCourseCollapsible extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: nameToId(this.props.course),
            heading: `CGCourseCollapsible_heading_${nameToId(this.props.course)}`,
            content: `CGCourseCollapsible_content_${nameToId(this.props.course)}`,
            open: false
        };
    }

    render() {
        return (
        <div className="card">
            <div className="card-header" id={this.state.heading} aria-controls={this.state.content} aria-expanded={this.state.open} onClick={() => this.setState({open: !this.state.open})}>
                <h5 className="mb-0 cg-card-title">
                    <CGCourseHeader course={this.props.course} />
                </h5>
            </div>
            <Collapse in={this.state.open}>
                <div>
                <div id={this.state.content} className="card-body">
                    Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                </div>
                </div>
            </Collapse>
        </div>
        );
    }
}


/* <div className="card">
    <div className="card-header" id={this.state.heading} data-toggle="collapse" data-target={`#${this.state.content}`} aria-expanded="false" aria-controls={this.state.content}>
        <h5 className="mb-0 cg-card-title">
            <i className="material-icons">class</i>{this.props.course}
        </h5>
    </div>
    <div id={this.state.content} className="collapse show" aria-labelledby={this.state.heading} data-parent={this.props.parent}>
        <div className="card-body">
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
        </div>
    </div>
</div> */

/*

<div class="cg-content">
    <div class="accordion" id="accordionExample">
        <div class="card">
            <div class="card-header" id="headingOne" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                <h5 class="mb-0 cg-card-title">
                    <i class="material-icons">computer</i>COSC 2430
                </h5>
            </div>
            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header" id="headingTwo" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                <h5 class="mb-0 cg-card-title">
                    <i class="material-icons">memory</i>ECE 3364
                </h5>
            </div>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
            <div class="card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
            </div>
        </div>
    </div>
</div>

*/


CGCourseCollapsible.propTypes = {
    course: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired
};

export default CGCourseCollapsible;

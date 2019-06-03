import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse'
import Card from 'react-bootstrap/Card';

import PropTypes from 'prop-types';

import CGCourseCollapsible from './CGCourseCollapsible.jsx';
import CGCourseHeader from './CGCourseHeader.jsx';
import { definitions } from './IconKey.js';

class CGCourseResults extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: ['COSC 2430', 'ECE 3364', 'ENGL 1303', 'HIST 1378', 'FREN 2301', 'MATH 3339']
        };
    }

    nameToId(course) {
        // base64 of course name
        let id = btoa(course)
        id = id.substring(0,id.length-1)
        return id.slice()
    }

    render() {
        return (
        <div className="cg-content">
            <div className="accordion" id="accordionExample">
                {/* {this.state.selection.map(elem => {
                    return (
                        <CGCourseCollapsible key={this.nameToId(elem)} course={elem} parent="#accordionExample" />
                    )
                })} */}
                {/* Testing icons */}
                {Object.keys(definitions).filter(t => definitions[t] !== null).map(elem => {
                    return (
                        <CGCourseCollapsible key={this.nameToId(elem)} course={elem} parent="#accordionExample" />
                    )
                })}
            </div>
        </div>
        );
    }
}

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


// CGCourseAccordion.propTypes = {
//     hookQuery: PropTypes.func.isRequired
// };

export default CGCourseResults;

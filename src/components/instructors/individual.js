import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import Util from '../_common/util';

import { Link } from 'react-router-dom';

import ArrowBack from '@material-ui/icons/ArrowBack';

import './individual.scss';

class IndividualInstructor extends Component {
    constructor(props) {
        super()
        this.state = {
            instructor: null
        }
    }

    componentDidMount() {
        (async () => {
            let db = this.props.db;
            db.collection('instructors')
            .where('fullName', '==', this.props.fullName)
            .get()
            .then((querySnapshot) => {
                if(querySnapshot.docs.length > 0) {
                    let doc = querySnapshot.docs[0].data();
                    this.setState({
                        instructor: doc
                    });
                }
            });
        })();
    }

    render() {
        return (
        <Container>
            <div className="individual-instructor">
                <p className="back-to-search"><Button as={Link} to={{
                    pathname: '/instructors'
                }}><ArrowBack/><span>Go Back</span></Button></p>

                <h3>{this.props.fullName}</h3>

                {this.state.instructor ? 
                    <div>
                        <h5 className="text-muted">{Util.subject_str(this.state.instructor.departments)}</h5>
                        <Tabs defaultActiveKey="stats">
                            <Tab className="tab-stats" eventKey="stats" title="Statistics">
                                <ul className="list-unstyled">
                                    <li>First name: <code>{this.state.instructor.firstName}</code></li>
                                    <li>Last name: <code>{this.state.instructor.lastName}</code></li>
                                    <li># of unique courses taught: <code>{this.state.instructor.courses_count}</code></li>
                                    <li># of unique sections taught: <code>{this.state.instructor.sections_count}</code></li>
                                    <hr />
                                    <li>GPA minimum: <code>{this.state.instructor.GPA.minimum}</code></li>
                                    <li>GPA average: <code>{this.state.instructor.GPA.average}</code></li>
                                    <li>GPA maximum: <code>{this.state.instructor.GPA.maximum}</code></li>
                                    <li>GPA median: <code>{this.state.instructor.GPA.median}</code></li>
                                    <li>GPA range: <code>{this.state.instructor.GPA.range}</code></li>
                                    <li>GPA standard deviation: <code>{this.state.instructor.GPA.standardDeviation}</code></li>
                                </ul>
                            </Tab>
                            <Tab className="tab-courses" eventKey="courses" title="Courses" disabled>
                                <p>Courses</p>
                            </Tab>
                            <Tab className="tab-sections" eventKey="sections" title="Sections" disabled>
                                <p>Sections</p>
                            </Tab>
                        </Tabs>
                        
                    </div> 
                    : <></>}
                {/* <CGCourseContent course={this.props.course} onLoaded={(course) => this.handleLoaded(course)} className="text-center" parent="individual" firebase={this.props.firebase} db={this.props.db} /> */}
            </div>
        </Container>
        );
    }
}

export default IndividualInstructor;
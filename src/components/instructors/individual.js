import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

import Subjects from '../_common/subjects.json';
import Util from '../_common/util';

import { Link } from 'react-router-dom';

import ArrowBack from '@material-ui/icons/ArrowBack';

import './individual.scss';

class IndividualInstructor extends Component {
    constructor(props) {
        super()
        this.state = {
            instructor: null,
            courses: [],
            sections: []
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
                    // update the interface with the fetched data so far
                    this.setState({
                        instructor: doc
                    });
                    // TODO: fetch courses and sections here
                    let crs = [];
                    let sctn = [];
                    // run asynchronously
                    (async () => {
                        for(let i = 0; i < doc.courses.length; i++) {
                            crs.push((await doc.courses[i].get()).data())
                        }
                        this.setState({
                            courses: crs
                        })
                    })();
                    
                    (async () => {
                        for(let i = 0; i < doc.sections.length; i++) {
                            sctn.push((await doc.sections[i].get()).data())
                        }
                        sctn.sort((a,b) => {
                            // descending a > b
                            // ascending a < b
                            // TODO: sort by course then date
                            return a.term > b.term
                        })
                        this.setState({
                            sections: sctn
                        })
                    })();
                }
            });
        })();
    }
    
    taughtSentence() {
        let depts = Object.keys(this.state.instructor.departments);
        let str = '';
        let taught = [];
        // generate list of department titles and the number of sections taught
        for(let i = 0; i < depts.length; i++) {
            taught.push({
                title: Subjects[depts[i]],
                num: this.state.instructor.departments[depts[i]]
            })
        }
        // sort the list
        taught.sort((a,b) => {
            // ascending
            return a.num < b.num;
        })
        for(let i = 0; i < taught.length; i++) {
            // write intro
            if(i === 0) {
                str += `${this.state.instructor.fullName} has taught `;
            }
            
            // if not first and list has 3 or more items
            if(i > 0 && taught.length > 2) {
                str += ', '
            }
            
            // edge case for 2 items: if end of list AND list is one item
            if(i === (taught.length-1) && i === 1) {
                str += ' and '
            }
            else if(i === (taught.length-1) && taught.length > 2) {
                str += 'and '
            }
            
            // always add thing
            str += `${taught[i].num} ${taught[i].title} course`
            // plural
            if(taught[i].num > 1) str += 's'
            
            // if end of list AND list is one item
            if(i === (taught.length-1)) {
                str += '.'
            }
        }
        return str;
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
                                    <li>{this.taughtSentence()}</li>
                                    <hr />
                                    <li>GPA minimum: <code>{this.state.instructor.GPA.minimum}</code></li>
                                    <li>GPA average: <code>{this.state.instructor.GPA.average}</code></li>
                                    <li>GPA maximum: <code>{this.state.instructor.GPA.maximum}</code></li>
                                    <li>GPA median: <code>{this.state.instructor.GPA.median}</code></li>
                                    <li>GPA range: <code>{this.state.instructor.GPA.range}</code></li>
                                    <li>GPA standard deviation: <code>{this.state.instructor.GPA.standardDeviation}</code></li>
                                </ul>
                            </Tab>
                            <Tab className="tab-courses" eventKey="courses" title="Courses" disabled={this.state.courses.length === 0}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Description</th>
                                            <th>Total sections</th>
                                            <th>UH GPA</th>
                                            <th>Prof GPA</th>
                                            <th>Last taught</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.courses.map(item => {
                                            return (
                                                <tr>
                                                    <td>{`${item.department} ${item.catalogNumber}`}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.sectionCount}</td>
                                                    <td>{item.GPA.average}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab className="tab-sections" eventKey="sections" title="Sections" disabled={this.state.sections.length === 0}>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Term</th>
                                            <th>Section number</th>
                                            <th>Total sections</th>
                                            <th>Semester GPA</th>
                                            <th>Prof GPA</th>
                                            <th>UH GPA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.sections.map(item => {
                                            return (
                                                <tr>
                                                    <td></td>
                                                    <td>{item.termString}</td>
                                                    <td>{item.sectionNumber}</td>
                                                    <td></td>
                                                    <td>{item.semesterGPA}</td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
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
import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Table from 'react-bootstrap/Table';

import Util from '../_common/util';

import { Link } from 'react-router-dom';

import ArrowBack from '@material-ui/icons/ArrowBack';
import CircularProgress from '@material-ui/core/CircularProgress';

import './individual.scss';

class IndividualInstructor extends Component {
    constructor(props) {
        super()
        this.state = {
            instructor: null,
            courses: [],
            sections: [],
            loading: false
        }
    }

    componentDidMount() {
        console.time(`Fetch data ${this.props.fullName}`);
        (async () => {
            this.setState({
                loading: true,
            })
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
                    let crs = [];
                    let sctn = [];
                    // run asynchronously
                    (async () => {
                        //console.log(await doc.courses[0].get())
                        //console.log((await doc.courses[0].get()).data())
                        for(let i = 0; i < doc.courses.length; i++) {
                            // save Promises for data
                            crs.push(doc.courses[i].get())
                        }
                        // wait for all Promises to complete simultaneously
                        crs = await Promise.all(crs);
                        // extract data from firestore snapshot
                        crs = crs.map(item => item.data())
                        this.setState({
                            courses: crs
                        })
                        let psums = {};
                        let pnums = {};
                        for(let i = 0; i < doc.sections.length; i++) {
                            // save Promises for data
                            sctn.push(doc.sections[i].get())
                        }
                        sctn = await Promise.all(sctn);
                        for(let i = 0; i < sctn.length; i++) {
                            // Extract stored data
                            let d = sctn[i].data();
                            // Compute extra data from context
                            d['_path'] = doc.sections[i].path // "catalog/HIST 1378/sections/laskjdlaksjdha"
                            d['_course'] = doc.sections[i].path.split('/')[1]
                            d['_department'] = d['_course'].split(' ')[0]
                            d['_catalogNumber'] = d['_course'].split(' ')[1]

                            // Prof GPA calculation
                            if(psums[d['_course']] === undefined) psums[d['_course']] = 0;
                            if(pnums[d['_course']] === undefined) pnums[d['_course']] = 0;
                            // sum semesterGPA for all of a course
                            psums[d['_course']] += d.semesterGPA
                            // keep count of how many sections of a course
                            pnums[d['_course']] += 1;

                            // retrieve sectionCount and UH GPA from `crs` (this.state.courses) 
                            for(let j = 0; j < crs.length; j++) {
                                if(crs[j].department === d['_department'] && crs[j].catalogNumber === d['_catalogNumber']) {
                                    d['_sectionCount'] = crs[j].sectionCount;
                                    d['_GPA.average'] = crs[j].GPA.average;
                                    break;
                                }
                            }
                            // Save new changes
                            sctn[i] = d;
                        }

                        // Use computed psums and pnums for Prof GPA calculation
                        for(let i = 0; i < sctn.length; i++) {
                            // prevent division by 0
                            if(pnums[sctn[i]['_course']] > 0) {
                                // mean formula: sum / n
                                sctn[i]['_profGPA'] = psums[sctn[i]['_course']] / pnums[sctn[i]['_course']];
                                // populate `crs` with profGPA (this.state.courses)
                                for(let j = 0; j < crs.length; j++) {
                                    if(crs[j].department === sctn[i]['_department'] && crs[j].catalogNumber === sctn[i]['_catalogNumber'] && typeof crs[j].GPA.average === 'number') {
                                        crs[j]['_profGPA'] = sctn[i]['_profGPA'];
                                    }
                                }
                            }
                        }
                        for(let i = 0; i < crs.length; i++) {
                            let t = 0;
                            for(let j = 0; j < sctn.length; j++) {
                                if(crs[i].department === sctn[j]['_department'] && crs[i].catalogNumber === sctn[j]['_catalogNumber']) {
                                    t = Math.max(t, sctn[j].term);
                                }
                            }
                            crs[i]['_lastTaught'] = t;
                        }
                        
                        sctn = sctn.sort((a,b) => {
                            // descending a > b
                            // ascending a < b
                            // TODO: sort by course then date
                            return a.term < b.term
                        })
                        console.timeEnd(`Fetch data ${this.props.fullName}`);
                        this.setState({
                            courses: crs,
                            sections: sctn,
                            loading: false
                        })
                    })();
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
                        <h5>{Util.subject_str(this.state.instructor.departments)}</h5>
                        
                        {this.state.loading ? <CircularProgress className="individual-spinner" variant="indeterminate" size={30} color="secondary" /> : <></>}
                        
                        <Tabs defaultActiveKey="stats">
                            <Tab className="tab-stats" eventKey="stats" title="Statistics">
                                <ul className="list-unstyled">
                                    <li>First name: <code>{this.state.instructor.firstName}</code></li>
                                    <li>Last name: <code>{this.state.instructor.lastName}</code></li>
                                    <li>Number of unique courses taught: <code>{this.state.instructor.courses_count}</code></li>
                                    <li>Number of unique sections taught: <code>{this.state.instructor.sections_count}</code></li>
                                    <li>{Util.taughtSentence(this.state.instructor.fullName, this.state.instructor.departments)}</li>
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
                                <p>This table represents all the unique courses that {this.state.instructor.fullName} has taught within our dataset. The <em>All Professors' Avg (GPA)</em> column represents the GPA for that course across the entire university. The <em>Dr.{this.state.instructor.lastName}'s Avg (GPA)</em> column represents the GPA of {this.state.instructor.fullName}'s grade history for this specific course across only the sections they've taught of it.</p>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Description</th>
                                            <th>Total sections</th>
                                            <th>Dr.{this.state.instructor.lastName}'s Avg (GPA)</th>
                                            <th>All Professors' Avg (GPA)</th>
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
                                                    <td>{item['_profGPA'] ? item['_profGPA'].toFixed(3) : undefined}</td>
                                                    <td>{item.GPA.average ? item.GPA.average.toFixed(3) : undefined}</td>
                                                    <td>{item['_lastTaught'] ? Util.termString(item['_lastTaught']) : <small>Loading...</small>}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                            <Tab className="tab-sections" eventKey="sections" title="Sections" disabled={this.state.sections.length === 0}>
                            <p>This table represents all the unique sections that {this.state.instructor.fullName} has taught within our dataset. The <em>UH GPA</em> column represents the GPA for that course across the entire university. The <em>Prof GPA</em> column represents the GPA of {this.state.instructor.fullName}'s grade history for this specific course across only the sections they've taught of it. The <em>Semester GPA</em> column refers to the GPA of only the students registered for that specific section number for that semester.</p>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Course</th>
                                            <th>Term</th>
                                            <th>Section number</th>
                                            <th>Total sections</th>
                                            <th>Section Avg (GPA)</th>
                                            <th>Dr.{this.state.instructor.lastName}'s Avg (GPA)</th>
                                            <th>All Professors' Avg (GPA)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.sections.map(item => {
                                            return (
                                                <tr>
                                                    <td>{item['_course']}</td>
                                                    <td>{item.termString}</td>
                                                    <td>{item.sectionNumber}</td>
                                                    <td>{item['_sectionCount']}</td>
                                                    <td>{item.semesterGPA}</td>
                                                    <td>{item['_profGPA'] ? item['_profGPA'].toFixed(3) : undefined}</td>
                                                    <td>{item['_GPA.average'] ? item['_GPA.average'].toFixed(3) : undefined}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Tab>
                        </Tabs>
                        
                    </div> 
                    : <></>}
            </div>
        </Container>
        );
    }
}

export default IndividualInstructor;
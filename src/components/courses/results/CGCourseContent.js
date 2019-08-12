import React from 'react';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';

import { Chart } from 'react-google-charts';

import Processor from './Processor';
import Util from '../../_common/util';
//import ChartProcessor from './processor/ChartProcessor';

class CGCourseContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: null,
            tableData: null,
            chartData: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.valid !== nextState.valid);
    }

    // Only called once when created, not every render
    async componentDidMount() {
        let db = this.props.db;
        //console.log(`CGCourseContent#componentDidMount() -> ${this.props.course}`)

        console.time(`firestore (${this.props.course})`);

        // Query for requested course
        let courseRef = db.collection('catalog').doc(`${this.props.course}`);
        let courseSnap = await courseRef.get();

        // Test for existence
        if(courseSnap.exists) {
            //console.log(`Found ${this.props.course}`)
            // fetch the rest of the data
            let sectionsRef = courseRef.collection('sections');
            let sectionsSnap = await sectionsRef.get();
            console.timeEnd(`firestore (${this.props.course})`);
            console.time(`processor (${this.props.course})`)
            let processed = new Processor(db, courseRef, courseSnap, sectionsRef, sectionsSnap);

            this.setState({
                valid: true,
                tableData: processed.tableDataFlat,
                chartData: processed.chartData
            }, () => {
                this.props.onLoaded(processed.sections[0])
            })
            console.timeEnd(`processor (${this.props.course})`)
        }
        else {
            // The requested query doesn't exist
            //console.log(`DoesNotExist ${this.props.course}`)
            console.timeEnd(`firestore (${this.props.course})`);
            console.log(`processor (${this.props.course}): N/A - timer cancelled`)
            await Util.sleep(2000); // this fucking fixes it for some reason
            this.setState({
                valid: false
            }, () => {
                this.props.onLoaded(null)
            })
        }
    }

    componentWillUnmount() {
        //console.log(`CGCouseContent#componentWillUnmount() -> ${this.props.course}`)
    }

    render() {
        //console.log(`CGCouseContent#render() -> ${this.props.course}`)
        if(this.state.valid === null || this.state.valid === true) return (
            <div className="cg-charts">
                <div className="cg-chart-wrap">
                    <Chart 
                        width={window.innerWidth < 600 ? '500px' : (window.innerWidth > 1000 && this.props.parent === 'collapsible' ? '900px' : '100%')}
                        height={window.innerWidth < 800 ? '350px' : '450px'}
                        chartType="LineChart"
                        loader={<CircularProgress size={25} variant="indeterminate" />}
                        data={this.state.chartData}
                        options={{
                            title: `${this.props.course} Average GPA Over Time by Instructor`,
                            vAxis: {
                                title: 'Average GPA',
                                gridlines: {
                                    count: -1 //auto
                                },
                                maxValue: 4.0,
                                minValue: 0.0
                            },
                            hAxis: {
                                title: 'Semester',
                                gridlines: {
                                    count: -1 //auto
                                }
                            },
                            chartArea: {
                                width: '55%',
                                left: (window.innerWidth < 768 ? 55 : (window.innerWidth < 992 ? 120 : null))
                            },
                            pointSize: 5,
                            interpolateNulls: true //lines between point gaps
                        }}
                        chartEvents={[
                            {
                                eventName: 'error',
                                callback: (event) => {
                                    // prevent ugly red box when there's no data yet on first-mount
                                    event.google.visualization.errors.removeError(event.eventArgs[0].id)
                                }
                            }
                        ]}
                    />
                </div>
                <div className="cg-table-wrap">
                    <Chart 
                        width={window.innerWidth < 600 ? '500px' : (window.innerWidth > 1000 && this.props.parent === 'collapsible' ? '900px': '100%')}
                        height={'100%'}
                        chartType="Table"
                        className={`react-google-charts-table ${this.props.parent}`}
                        data={this.state.tableData}
                        options={{
                            showRowNumber: true,
                            cssClassNames: {
                                headerRow: 'headerRow',
                                tableRow: 'tableRow',
                                oddTableRow: 'oddTableRow',
                                selectedTableRow: 'selectedTableRow',
                                hoverTableRow: 'hoverTableRow',
                                headerCell: 'headerCell',
                                tableCell: 'tableCell',
                                rowNumberCell: 'rowNumberCell'
                            },
                            sortColumn: 0,
                            sortAscending: false
                        }}
                        chartEvents={[
                            {
                                eventName: 'error',
                                callback: (event) => {
                                    // prevent ugly red box when there's no data yet on first-mount
                                    event.google.visualization.errors.removeError(event.eventArgs[0].id)
                                }
                            }
                        ]}
                    />
                </div>
            </div>
        );
        return (<p>A course could not be found by that name</p>);
    }
}


CGCourseContent.propTypes = {
    course: PropTypes.string.isRequired,
    onLoaded: PropTypes.func.isRequired
};

export default CGCourseContent;

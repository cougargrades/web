import React from 'react';
import PropTypes from 'prop-types';

import { Chart } from 'react-google-charts';

import Processor from './Processor';
//import ChartProcessor from './processor/ChartProcessor';

class CGCourseContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lock: false,
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
        console.log(`CGCouseContent#componentDidMount() -> ${this.props.course}`)
        this.setState({
            lock: true
        })

        // Query for requested course
        let courseRef = db.collection('catalog').doc(`${this.props.course}`);
        let courseSnap = await courseRef.get();

        // Test for existence
        if(courseSnap.exists) {
            // fetch the rest of the data
            let sectionsRef = courseRef.collection('sections');
            let sectionsSnap = await sectionsRef.get();
            let processed = new Processor(db, courseRef, courseSnap, sectionsRef, sectionsSnap);

            this.setState({
                valid: true,
                tableData: processed.tableDataFlat,
                chartData: processed.chartData
            }, this.props.onLoaded)
        }
        else {
            // The requested query doesn't exist
            this.setState({
                valid: false
            }, this.props.onLoaded)
        }
    }

    render() {
        console.log(`CGCouseContent#render() -> ${this.props.course}`)
        if(this.state.valid) return (
            <div className="cg-charts">
                <div className="cg-chart-wrap">
                    <Chart 
                        width={window.innerWidth < 600 ? '500px' : (window.innerWidth > 1000 ? '900px': '100%')}
                        height={window.innerWidth < 800 ? '350px' : '450px'}
                        chartType="LineChart"
                        loader={<span className="spinner three-quarters-loader">&#x1F504;</span>} // 🔄
                        data={this.state.chartData}
                        options={{
                            title: this.props.course,
                            vAxis: {
                                title: 'GPA',
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
                    />
                </div>
                <div className="cg-table-wrap">
                    <Chart 
                        width={window.innerWidth < 600 ? '500px' : (window.innerWidth > 1000 ? '900px': '100%')}
                        height={'100%'}
                        chartType="Table"
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
                            sortColumn: 0
                        }}
                    />
                </div>
            </div>
        );

        if(this.state.valid === null) return (
            <span className="spinner three-quarters-loader">🔄</span>
        );

        return (<p>A course could not be found by that name</p>);
    }
}


CGCourseContent.propTypes = {
    course: PropTypes.string.isRequired,
    onLoaded: PropTypes.func.isRequired
};

export default CGCourseContent;

import React from 'react';
import PropTypes from 'prop-types';

import { Chart } from 'react-google-charts';

import CGTableData from './CGTableData.jsx';
import CGChartData from './CGChartData.jsx';
import { Course, SQLData } from './MiscClasses.js';

class CGCourseContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sql_data: [],
            table_data: null,
            chart_data: null
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.sql_data.length != nextState.sql_data.length);
    }

    async componentDidMount() {
        let course = new Course(this.props.course);
        let sql_data = new SQLData(await ((await fetch(`${CGBaseurl}/api/table/all/${course.dept}/${course.catalog_number}`)).json()));
        if(sql_data.data.length == 0) {
            this.setState({
                sql_data: [],
                table_data: [],
                chart_data: []
            })
            this.props.onLoaded()
        }
        else {
            let table_data = (await (new CGTableData(sql_data)).process()).table_data;
            let chart_data = (await (new CGChartData(sql_data)).process()).chart_data;
            //let chart_data = []
            this.setState({
                sql_data: sql_data,
                table_data: [table_data.columns, ...table_data.rows],
                chart_data: chart_data
            })
            this.props.onLoaded()
        }
    }

    render() {
        return (
            <div className="cg-charts">
                <div className="cg-chart-wrap">
                    <Chart 
                        width={window.innerWidth < 600 ? '500px' : (window.innerWidth > 1000 ? '900px': '100%')}
                        height={window.innerWidth < 800 ? '350px' : '450px'}
                        chartType="LineChart"
                        loader={<span className="spinner three-quarters-loader">🔄</span>}
                        data={this.state.chart_data}
                        options={{
                            width: '100%',
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
                        data={this.state.table_data}
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
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}


CGCourseContent.propTypes = {
    course: PropTypes.string.isRequired,
    onLoaded: PropTypes.func.isRequired
};

export default CGCourseContent;

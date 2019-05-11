
class Chart extends Displayable {
    constructor(baseurl, sqldata) {
        super()
        if(sqldata instanceof SQLData) {
            this.baseurl = baseurl
            this.chart_container = null
            this.sql_data = sqldata.data
            this.chart_data = null
        }
        else {
            throw "Invalid constructor parameters"
        }
    }

    setElement(element) {
        if(element instanceof HTMLElement) {
            this.chart_container = element
        }
        else {
            throw "Invalid parameters"
        }
    }

    async process() {
        if(this.chart_container instanceof HTMLElement) {
            await this.transpose()
            await this.display()
        }
        else {
            throw "chart_container not set"
        }
        console.log(this)
    }

    // heavily inspired by: https://anex.us/grades/drawGraph.js
    async transpose() {
        if(this.sql_data == null || this.sql_data.length == 0) {
            this.chart_container.innerText = "No data retrieved for that course. Maybe a typo?"
            return
        }

        //make column headings for chart
        let cols = new Set() //ensure each prof only appears once in columns
        cols.add('Semester')
        for(let elem of this.sql_data) {
            cols.add(`${elem.INSTR_LAST_NAME}, ${elem.INSTR_FIRST_NAME}`)
        }
        cols = Array.from(cols)

        let graphArray = []
        graphArray.push(cols)
        
        let colsMap = new Map()
        for(let i = 0; i < cols.length; ++i) {
            colsMap.set(cols[i], i); //map prof name to column index
        }

        let rowsMap = new Map(); //map semester to row in chart data
        let studentsMap = new Map(); //map semester + prof to number of students taught by that prof in that semsester
        for(let i = 0; i < this.sql_data.length; ++i) { //add GPAs to chart data
            if(this.sql_data[i].AVG_GPA === null) { //skip secions with no GPA
                continue;
            }
            let gpa = this.sql_data[i].AVG_GPA;
            let students = parseInt(this.sql_data[i].A, 10)
                + parseInt(this.sql_data[i].B, 10)
                + parseInt(this.sql_data[i].C, 10)
                + parseInt(this.sql_data[i].D, 10)
                + parseInt(this.sql_data[i].F, 10);
            let instructor = `${this.sql_data[i].INSTR_LAST_NAME}, ${this.sql_data[i].INSTR_FIRST_NAME}`;
            let rowID = graphArray.length;
            let term = this.sql_data[i].TERM.split(' ').reverse().join(' '); // "Fall 2013" => "2013 Fall"
            
            if(typeof studentsMap.get(`${term} ${instructor}`) === 'undefined') { //if first section prof has taught this semester
                studentsMap.set(`${term} ${instructor}`, students) //set number of students in section
            }
            else {
                studentsMap.set(`${term} ${instructor}`,
                    studentsMap.get(`${term} ${instructor}`) + students) //increment number of students taught this semester
            }
            if(typeof rowsMap.get(term) === 'undefined') { //if row for semester doesn't exist in chart data
                //initialize row
                rowsMap.set(term, rowID);
                let newRow = new Array(cols.length);
                newRow[0] = (term);
                graphArray.push(newRow);
            }
            else {
                rowID = rowsMap.get(term);
            }
            if(typeof graphArray[rowID][colsMap.get(instructor)] === 'undefined') { //initialize cell
                graphArray[rowID][colsMap.get(instructor)] = 0;
            }
            graphArray[rowID][colsMap.get(instructor)] += gpa*students; //increment student-weighted GPA
        }
        for(let i = 1; i < graphArray.length; ++i) {
            for(let j = 1; j < graphArray[i].length; ++j) {
                if(typeof graphArray[i][j] !== 'undefined') {
                    graphArray[i][j] /= studentsMap.get(`${graphArray[i][0]} ${graphArray[0][j]}`) //student-weighted average GPAs
                    graphArray[i][j] = parseFloat(graphArray[i][j].toFixed(3)) //round to 3 (for cleanliness in tooltip)
                }
            }
        }
        this.chart_data = graphArray;
    }

    async display() {
        if(this.chart_data == null) {
            return
        }
        
        var data = google.visualization.arrayToDataTable(this.chart_data)
        var options = {
            title: `${this.sql_data[0].SUBJECT} ${this.sql_data[0].CATALOG_NBR}: ${this.sql_data[0].COURSE_DESCR}`,
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
        };

        var chart = new google.visualization.LineChart(this.chart_container);
        chart.draw(data, options);
    }
}
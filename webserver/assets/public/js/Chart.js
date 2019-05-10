
class Chart {
    constructor(baseurl, dept, course, element) {
        if(typeof(dept) == 'string' && dept != "" && typeof(course) == 'string' && course != "") {
            this.baseurl = baseurl
            this.dept = dept
            this.course = course
            this.chart_container = element
            this.sql_data = null
            this.chart_data = null
        }
        else {
            this.broken = true
        }
    }

    get friendly_column_names() {
        return {
            "ID": "ID",
            "TERM": "Term",
            "SUBJECT": "Department",
            "CATALOG_NBR": "Course",
            "CLASS_SECTION": "Section",
            "COURSE_DESCR": "Course Description",
            "INSTR_LAST_NAME": "Instructor",
            "INSTR_FIRST_NAME": "Instructor First Name",
            "A": "A",
            "B": "B",
            "C": "C",
            "D": "D",
            "F": "F",
            "Q": "Q",
            "AVG_GPA": "GPA",
            "PROF_COUNT": "Section count",
            "PROF_AVG": "Professor AVG",
            "TERM_CODE": "Term code",
            "GROUP_CODE": "Group code"
        }
    }

    get used_columns() {
        return [
            "TERM",
            "SUBJECT",
            "CATALOG_NBR",
            "CLASS_SECTION",
            "COURSE_DESCR",
            "INSTR_LAST_NAME",
            "A",
            "B",
            "C",
            "D",
            "F",
            "Q",
            "AVG_GPA"
        ]
    }

    async process() {
        if(this.broken)
            return
        await this.fetch()
        await this.transpose()
        //await this.filter()
        //await this.format()
        await this.display()
    }

    async fetch() {
        try {
            this.sql_data = await ((await fetch(`${this.baseurl}/api/table/all/${this.dept}/${this.course}`)).json())
        }
        catch(err) {
            //
        }
    }

    // heavily inspired by: https://anex.us/grades/drawGraph.js
    async transpose() {
        if(this.sql_data == null || this.sql_data.length == 0) {
            return
        }

        // var data = google.visualization.arrayToDataTable([
        //     ['Year', 'Sales', 'Expenses'],
        //     ['2004',  1000,      400],
        //     ['2005',  1170,      460],
        //     ['2006',  660,       1120],
        //     ['2007',  1030,      540]
        // ])

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
                console.log(newRow)
            }
            else {
                rowID = rowsMap.get(term);
            }
            console.log(colsMap.get(instructor))
            console.log(graphArray[rowID][colsMap.get(instructor)])
            if(typeof graphArray[rowID][colsMap.get(instructor)] === 'undefined') { //initialize cell
                graphArray[rowID][colsMap.get(instructor)] = 0;
            }
            graphArray[rowID][colsMap.get(instructor)] += gpa*students; //increment student-weighted GPA
            console.log(graphArray[rowID][colsMap.get(instructor)])
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

    async filter() {
        // Filter columns
        this.table_data.columns = this.table_data.columns.filter(elem => {
            return !(elem instanceof Undesired);
        })

        // Filter rows
        for(let i = 0; i < this.table_data.rows.length; i++) {
            this.table_data.rows[i] = this.table_data.rows[i].filter(elem => {
                return !(elem instanceof Undesired);
            })
        }
    }

    async format() {
        // Format cell data

        // For every row
        this.table_data.rows = this.table_data.rows.map((row, location, array) => {
            // For every position in the row
            return row.map((value, index) => {

                // Special cases where default formatting isn't desired
                if(this.used_columns[index] == 'TERM') {
                    // Sort by chonologically, not alphabetically
                    return {
                        v: String(this.sql_data[location]['TERM_CODE']), 
                        f: value
                    }
                }
                else if(this.used_columns[index] == 'CATALOG_NBR') {
                    // Don't put commas in course numbers
                    return {
                        v: value,
                        f: String(value)
                    }
                }
                else if(this.used_columns[index] == 'INSTR_LAST_NAME') {
                    // Keep instructor info in one column
                    return `${value}, ${this.sql_data[location]['INSTR_FIRST_NAME']}`
                }
                else {
                    return value
                }
                
            })
        })
    }

    async display() {
        if(this.chart_data == null) {
            console.log('Nothing to display')
            return
        }
        
        console.log(this.chart_data)
        var data = google.visualization.arrayToDataTable(this.chart_data)
        // var data = google.visualization.arrayToDataTable([
        //     ['Year', 'Sales', 'Expenses'],
        //     ['2004',  1000,      400],
        //     ['2005',  1170,      460],
        //     ['2006',  660,       1120],
        //     ['2007',  1030,      540]
        // ])
        var options = {
            vAxis: {
                title: 'GPA',
                gridlines: {
                    count: -1 //auto
                }
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
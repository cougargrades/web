import Course from './Course';

class Processor {
    /**
     * A processor class used to tabulate NoSQL data
     * @param {firebase.firestore.Firestore} db - Reference to Firestore instance in case follow-up queries are necessary
     * @param {firebase.firestore.DocumentReference} courseRef - Document reference to the course
     * @param {firebase.firestore.DocumentSnapshot} courseSnap - Document snapshot of the course
     * @param {firebase.firestore.CollectionReference} sectionsRef - Collection reference of the course's total sections
     * @param {firebase.firestore.QueryDocumentSnapshot} sectionsSnap - Collection snapshot of all the course's total sections
     */
    constructor(db, courseRef, courseSnap, sectionsRef, sectionsSnap) {
        this.sections = sectionsSnap.docs.map(doc => new Course(courseSnap, doc))
    }

    /**
     * Generate table data compatible with a Table Chart from the Google Charts API.
     * @returns {object} Table chart data
     */
    get tableData() {
        let self = this;
        let expanded = Course.expand(this.sections);

        return {
            columns: (() => {
                return Object.keys(expanded[0])
                        // only keep desired keys
                        .filter(key => self.enabledColumns.includes(key))
                        // sort columns in the desired order
                        // https://stackoverflow.com/a/44063445
                        .sort((a,b) => self.enabledColumns.indexOf(a) - self.enabledColumns.indexOf(b))
                        // add extra info for the keys we're keeping
                        .map(key => {
                            return {
                                type: typeof(expanded[0][key]), // presumes that first index doesn't have null values
                                label: self.friendlyColumnNames[key],
                                key: key // not used by Google Charts
                            };
                        });
            })(),
            rows: (() => {
                return expanded
                        // Transpose Object array to nested arrays
                        // Remove unwanted properties from every row
                        .map(row => {
                            // for every key
                            return Object.keys(row)
                                // sort columns in the desired order
                                // https://stackoverflow.com/a/44063445
                                .sort((a,b) => self.enabledColumns.indexOf(a) - self.enabledColumns.indexOf(b))
                                // if key is desired, replace with value. if not desired, replace with signalValue.
                                .map(key => self.enabledColumns.includes(key) ? row[key] : this.signalValue)
                                // filter out occurences of signalValue values
                                .filter(row => row !== this.signalValue);
                        })
                        // Format specific columns to better use the Google Chart
                        // Special cases where default formatting isn't desired
                        .map((row, i, array) => {
                            // For every position in the row
                            return row.map((col, j) => {
                                // Sort termString chronologically, not alphabetically
                                if(self.enabledColumns[j] === 'termString') {
                                    return {
                                        v: String(expanded[i]['term']),
                                        f: col
                                    }
                                }

                                // Don't put commas in course numbers
                                if(self.enabledColumns[j] === 'catalogNumber') {
                                    return {
                                        v: col,
                                        f: String(col)
                                    }
                                }
                                
                                // default is to not change
                                return col;
                            })
                        })
            })()
        }
    }

    /**
     * Processor.tableData flattened with spread operator: `[temp.columns, ...temp.rows]`
     * @returns {object} Table chart data
     */
    get tableDataFlat() {
        let temp = this.tableData;
        return [temp.columns, ...temp.rows]
    }

    get friendlyColumnNames() {
        return {
            "termString": "Term",
            "department": "Department",
            "catalogNumber": "Course",
            "sectionNumber": "Section #",
            "description": "Course Description",
            "primaryInstructorFullName": "Instructor",
            "primaryInstructorTermGPA": "Instructor Average GPA",
            "primaryInstructorTermGPAmax": "Instructor Max GPA",
            "primaryInstructorTermGPAmin": "Instructor Min GPA",
            "primaryInstructorTermSectionsTaught": "Instructor # sections taught",
            "A": "A",
            "B": "B",
            "C": "C",
            "D": "D",
            "F": "F",
            "Q": "Q",
            "semesterGPA": "GPA",
            "term": "Term code"
        }
    }

    get enabledColumns() {
        return [
            "termString",
            "sectionNumber",
            "primaryInstructorFullName",
            "A",
            "B",
            "C",
            "D",
            "F",
            "Q",
            "semesterGPA"
        ]
    }

    /**
     * Values to be removed are replaced with this (hopefully) unique value that won't accidentally be genuine data (because the dataset can sometimes include nulls)
     */
    get signalValue() {
        // md5("io.cougargrades.web.Signal")
        return '6f953e48a019788a6630018acfbe9c93';
    }


    /**
     * Generate chart data compatible with a Line Chart from the Google Charts API
     * Adapted from: https://anex.us/grades/drawGraph.js
     * @returns {object} Line chart data
     */
    get chartData() {
        let expanded = Course.expand(this.sections);

        //make column headings for chart
        let cols = new Set() //ensure each prof only appears once in columns
        cols.add('Semester')
        for(let elem of expanded) {
            cols.add(elem['primaryInstructorFullName'])
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
        for(let i = 0; i < expanded.length; ++i) { //add GPAs to chart data
            if(expanded[i]['semesterGPA'] === null) { //skip secions with no GPA
                continue;
            }
            let gpa = expanded[i]['semesterGPA'];
            let students = parseInt(expanded[i]['A'], 10)
                + parseInt(expanded[i]['B'], 10)
                + parseInt(expanded[i]['C'], 10)
                + parseInt(expanded[i]['D'], 10)
                + parseInt(expanded[i]['F'], 10);
            let instructor = expanded[i]['primaryInstructorFullName'];
            let rowID = graphArray.length;
            let term = expanded[i]['termString'].split(' ').reverse().join(' '); // "Fall 2013" => "2013 Fall"
            
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
        // return a deepcopy of graphArray
        return JSON.parse(JSON.stringify(graphArray));
    }
}

export default Processor;
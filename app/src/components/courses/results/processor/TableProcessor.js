import Course from './Course';

class TableProcessor {
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
        //console.log(this.sections);
        this.expanded = Course.expand(this.sections);
        //console.log(this.expanded);
        //console.log(this);
        this.tableData = {}
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
            "term",
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

    async process() {
        await this.transpose()
        await this.filter()
        await this.format()
        return this
    }

    async transpose() {
        // Create columns
        this.tableData.columns = Object.keys(this.expanded[0])
            // only keep desired keys
            .filter(key => this.enabledColumns.includes(key))
            // sort columns in the desired order
            // https://stackoverflow.com/a/44063445
            .sort((a,b) => this.enabledColumns.indexOf(a) - this.enabledColumns.indexOf(b))
            // add extra info for the keys we're keeping
            .map(key => {
                return {
                    type: typeof(this.expanded[0][key]), // presumes that first index doesn't have null values
                    label: this.friendlyColumnNames[key],
                    key: key // not used by Google Charts
                };
            });
        
        this.tableData.rows = this.expanded
            // for every row
            .map(row => {
                // for every key
                return Object.keys(row)
                    // sort columns in the desired order
                    // https://stackoverflow.com/a/44063445
                    .sort((a,b) => this.enabledColumns.indexOf(a) - this.enabledColumns.indexOf(b))
                    // if key is desired, replace with value. if not desired, replace with null.
                    .map(key => this.enabledColumns.includes(key) ? row[key] : null)
                    // filter out null values
                    .filter(row => row !== null);
            })
        return;
    }

    async filter() {
        // Filter columns
        this.table_data.columns = this.table_data.columns.filter(elem => {
            //return !(elem instanceof Undesired);
        })

        // Filter rows
        for(let i = 0; i < this.table_data.rows.length; i++) {
            this.table_data.rows[i] = this.table_data.rows[i].filter(elem => {
                //return !(elem instanceof Undesired);
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
                if(this.used_columns[index] === 'TERM') {
                    // Sort by chonologically, not alphabetically
                    return {
                        v: String(this.sql_data[location]['TERM_CODE']), 
                        f: value
                    }
                }
                else if(this.used_columns[index] === 'CATALOG_NBR') {
                    // Don't put commas in course numbers
                    return {
                        v: value,
                        f: String(value)
                    }
                }
                else if(this.used_columns[index] === 'INSTR_LAST_NAME') {
                    // Keep instructor info in one column
                    return `${value}, ${this.sql_data[location]['INSTR_FIRST_NAME']}`
                }
                else {
                    return value
                }
                
            })
        })
    }
}

export default TableProcessor;
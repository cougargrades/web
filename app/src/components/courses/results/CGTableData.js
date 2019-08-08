import { SQLData, Undesired } from './MiscClasses';

class CGTableData {
    constructor(sqldata) {
        if(sqldata instanceof SQLData) {
            this.sql_data = sqldata.data
            this.table_data = null
        }
        else {
            throw new Error("Invalid constructor parameters")
        }
    }

    get friendly_column_names() {
        return {
            "ID": "ID",
            "TERM": "Term",
            "DEPT": "Department",
            "CATALOG_NBR": "Course",
            "CLASS_SECTION": "Section #",
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
            "CLASS_SECTION",
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
        await this.transpose()
        await this.filter()
        await this.format()
        return this
    }

    async transpose() {
        if(this.sql_data === null || this.sql_data.length === 0) {
            return
        }
        this.table_data = {}

        // Create columns
        this.table_data.columns = Object.keys(this.sql_data[0]).map((value, index, array) => {
            if(this.used_columns.includes(value)) {
                return {
                    type: typeof(this.sql_data[0][value]),
                    label: this.friendly_column_names[value]
                }
            }
            else {
                return new Undesired()
            }
        })

        // Create rows
        this.table_data.rows = this.sql_data.map(row => {
            return Object.keys(row).map(key => {
                if(this.used_columns.includes(key)) {
                    return row[key]
                }
                else {
                    return new Undesired()
                }
            })
        })
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

export default CGTableData;
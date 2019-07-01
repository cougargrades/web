export class Course {
    constructor(dept, catalog_number) {
        if(typeof(dept) == 'string' && dept != "") {
            if(typeof(catalog_number) == 'string' && catalog_number != "") {
                this.dept = dept
                this.catalog_number = catalog_number
            }
            else if(typeof(catalog_number) == 'undefined') {
                this.dept = dept.split(' ')[0]
                this.catalog_number = dept.split(' ')[1]
            }
        }
        else {
            throw "Invalid constructor parameters";
        }   
    }
}

export class SQLData {
    constructor(data) {
        this.data = data
    }
}

export class Undesired {
    constructor() {
        //
    }
}

export function nameToId(course) {
    // base64 of course name
    let id = btoa(course)
    id = id.substring(0,id.length)
    return id.slice()
}

export default {};
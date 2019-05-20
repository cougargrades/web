class Course {
    constructor(dept, catalog_number) {
        if(typeof(dept) == 'string' && dept != "" && typeof(catalog_number) == 'string' && catalog_number != "") {
            this.dept = dept
            this.catalog_number = catalog_number
        }
        else {
            throw "Invalid constructor parameters";
        }   
    }
}

class SQLData {
    constructor(data) {
        this.data = data
    }
}

class Displayable {
    constructor() {
        //
    }
    setElement(element) {
        throw "This method must be implemented."
    }
    process() {
        throw "This method must be implemented."
    }
}
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

// https://medium.com/@TCAS3/debounce-deep-dive-javascript-es6-e6f8d983b7a1
const debounce = (fn, time) => {
    let timeout;

    return function() {
        const functionCall = () => fn.apply(this, arguments);
        
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
    }
}

function throttle(callback, wait, immediate = false) {
    let timeout = null 
    let initialCall = true

    return function() {
        const callNow = immediate && initialCall
        const next = () => {
            callback.apply(this, arguments)
            timeout = null
        }

        if (callNow) { 
            initialCall = false
            next()
        }

        if (!timeout) {
            timeout = setTimeout(next, wait)
        }
    }
}


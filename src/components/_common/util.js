
import Subjects from './subjects.json';

class Util {
    
    /**
     * @param {number} termCode Term code
     * @returns {string} Term string
     */
    static termString(termCode) {
        let year = String(termCode).substring(0,4)
        switch(parseInt(String(termCode).substring(4,6))) {
            case 1: {
                return `Spring ${year}`
            }
            case 2: {
                return `Summer ${year}`
            }
            case 3: {
                return `Fall ${year}`
            }
            default: {
                return `${termCode}`
            }
        }   
    }

    /**
     * Use like: `await sleep(1000)`
     * From: https://stackoverflow.com/a/39914235
     * @param {number} ms - milliseconds to sleep
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static subject_str(dict) {
        let depts = Object.keys(dict)
        let str = ''
        for(let i = 0; i < depts.length; i++) {
            if(i === (depts.length - 1)) {
                str += Subjects[depts[i]]
            }
            else {
                str += `${str += Subjects[depts[i]]}, `
            }
        }
        return str ? str : 'Instructor';
    }
}

export default Util;
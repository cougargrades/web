
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
}

export default Util;
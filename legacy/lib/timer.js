
const prettyHrtime = require('pretty-hrtime');
const convertHrtime = require('convert-hrtime');
// if measurement callback isn't provided as expected, set it to null
const getFuncs = (val, measured) => (typeof measured === 'function' && measured.constructor.name === 'AsyncFunction') ? [val, measured] : [val, null];
const getArgs = (A, B) => [A, B];

const timer = (...args) => {
    const [val, measured] = getFuncs(...args);
    
    return (...args) => {
        const start = process.hrtime();
        const res = val(...args);
        const end = process.hrtime(start);
        if(measured !== null) {
            measured(prettyHrtime(end), convertHrtime(end), ...args)
        }
        else {
            console.log(prettyHrtime(end))
        }

        return res;
    }
};

module.exports = timer
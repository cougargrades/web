
// generate delay synchronously
function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}
function checkPrimes() {
    for(let i = 0; i < 100000; i++) {
        isPrime(i)
    }
}

const getArgs = (val, measured) => (typeof measured === 'function' && measured.constructor.name === 'AsyncFunction') ? [val, measured] : [val, null];
const getMiddle = (A, B) => [A, B];

const timer = (...args) => {
    const [val, measured] = getArgs(...args);
    
    return (...args) => {
        const [A, B] = getMiddle(...args)
        console.log(`middle A: ${A}`)
        console.log(`middle B: ${B}`)
        const start = process.hrtime();
        const res = val(...args);
        const end = process.hrtime(start);
        if(measured !== null) {
            measured(prettyHrtime(end), end)
        }
        else {
            console.log(prettyHrtime(end))
        }

        return res;
    }
};

timer(async (a,b) => {
    checkPrimes()
    console.log(`A: ${a}`)
    console.log(`B: ${b}`)
}, async (pretty, hrtime) => {
    console.log(`pretty time: ${pretty}`)
})("thing 1", "thing 2")
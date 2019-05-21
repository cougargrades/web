
const REVISION = new String(process.env.SOURCE_COMMIT).substring(0,7)

const timer = require('./lib/timer')
const db = require('./lib/db')
const chalk = require('chalk')
const log = async (pretty, duration, request) => {
    let color = 'green'
    if(duration.milliseconds > 40) {
        color = 'yellow'
    }
    if(duration.milliseconds > 100) {
        color = 'red'
    }
    console.log(chalk[color](`${request.ip} - [${new Date().toLocaleString()}] - ${request.raw.method} ${request.raw.url} ${pretty}`))
}

async function routes (fastify, options) {
    // (ID int primary key, TERM text, DEPT text, CATALOG_NBR smallint, CLASS_SECTION smallint, COURSE_DESCR text, INSTR_LAST_NAME text, INSTR_FIRST_NAME text, A smallint, B smallint, C smallint, D smallint, F smallint, Q smallint, AVG_GPA real, PROF_COUNT smallint, PROF_AVG real, TERM_CODE smallint, GROUP_CODE text)

    fastify.get('/', timer(async (request, reply) => {
        reply.type('application/json')
        return `Welcome to the ${request.raw.url}`
    }, log))

    fastify.get('/api/', timer(async (request, reply) => {
        reply.type('application/json')
        return `Welcome to the ${request.raw.url}`
    }, log))

    fastify.get('/api/catalog/list/terms', timer(async (request, reply) => {
        reply.type('application/json')
        return (await db.query('SELECT DISTINCT TERM_CODE FROM records ORDER BY TERM_CODE ASC')).map(a => a['TERM_CODE'])
    }, log))

    fastify.get('/api/catalog/list/depts', timer(async (request, reply) => {
        reply.type('application/json')
        return (await db.query('SELECT DISTINCT DEPT FROM records ORDER BY DEPT ASC')).map(a => a['DEPT'])
    }, log))
    
    fastify.get('/api/catalog/list/numbers', timer(async (request, reply) => {
        reply.type('application/json')
        return (await db.query('SELECT DISTINCT CATALOG_NBR FROM records ORDER BY DEPT ASC')).map(a => (typeof a['CATALOG_NBR'] === 'string' ? a['CATALOG_NBR'].trim() : a['CATALOG_NBR']))
    }, log))

    fastify.get('/api/catalog/list/courses/:term/:dept', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            if(request.params.dept.toLowerCase() === 'all') {
                return (await db.query('SELECT DISTINCT DEPT, CATALOG_NBR FROM records ORDER BY DEPT ASC, CATALOG_NBR ASC')).map(a => `${a['DEPT']} ${a['CATALOG_NBR']}`)
            }
            else {
                return (await db.execute('SELECT DISTINCT CATALOG_NBR FROM records WHERE DEPT=? ORDER BY CATALOG_NBR ASC', [request.params.dept])).map(a => a['CATALOG_NBR'])
            }
        }
        else {
            return (await db.execute('SELECT DISTINCT CATALOG_NBR FROM records WHERE TERM_CODE=? AND DEPT=? ORDER BY CATALOG_NBR ASC', [request.params.term, request.params.dept])).map(a => a['CATALOG_NBR'])
        }
    }, log))
    fastify.get('/api/catalog/list/sections/:term/:dept/:course', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            return (await db.execute('SELECT DISTINCT CLASS_SECTION FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC', [request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
        }
        else {
            return (await db.execute('SELECT DISTINCT CLASS_SECTION FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC', [request.params.term, request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
        }
    }, log))

    fastify.get('/api/table/:term/:dept/:course/:section', timer(async (request, reply) => {
        reply.type('application/json')
        return (await db.execute('SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? AND CLASS_SECTION=? ORDER BY TERM_CODE ASC', [request.params.term, request.params.dept, request.params.course, request.params.section]))
    }, log))

    fastify.get('/api/table/:term/:dept/:course', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === "all") {
            return (await db.execute('SELECT * FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC', [request.params.dept, request.params.course]))
        }
        else {
            return (await db.execute('SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC', [request.params.term, request.params.dept, request.params.course]))
        }
    }, log))
}

module.exports = routes
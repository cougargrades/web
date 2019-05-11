
const REVISION = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

const config = require('./config.json')
const db = require('better-sqlite3')('records.db', {
    readonly: true,
    fileMustExist: true
});

const timer = require('./timer')
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

    // (ID int primary key, TERM text, SUBJECT text, CATALOG_NBR smallint, CLASS_SECTION smallint, COURSE_DESCR text, INSTR_LAST_NAME text, INSTR_FIRST_NAME text, A smallint, B smallint, C smallint, D smallint, F smallint, Q smallint, AVG_GPA real, PROF_COUNT smallint, PROF_AVG real, TERM_CODE smallint, GROUP_CODE text)

    fastify.get('/', timer(async (request, reply) => {
        return await reply.view('./templates/index.mustache', { baseurl: config.baseurl, commit: REVISION })
    }, log))

    fastify.get('/api/catalog/list/terms', timer(async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT DISTINCT TERM_CODE FROM records ORDER BY TERM_CODE ASC').all().map(a => a['TERM_CODE'])
    }, log))

    fastify.get('/api/catalog/list/depts', timer(async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT DISTINCT SUBJECT FROM records ORDER BY SUBJECT ASC').all().map(a => a['SUBJECT'])
    }, log))

    fastify.get('/api/catalog/list/courses/:term/:dept', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            return db.prepare('SELECT DISTINCT CATALOG_NBR FROM records WHERE SUBJECT=? ORDER BY CATALOG_NBR ASC').all(request.params.dept).map(a => a['CATALOG_NBR'])
        }
        else {
            return db.prepare('SELECT DISTINCT CATALOG_NBR FROM records WHERE TERM_CODE=? AND SUBJECT=? ORDER BY CATALOG_NBR ASC').all(request.params.term, request.params.dept).map(a => a['CATALOG_NBR'])
        }
    }, log))
    fastify.get('/api/catalog/list/sections/:term/:dept/:course', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            return db.prepare('SELECT DISTINCT CLASS_SECTION FROM records WHERE SUBJECT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC').all(request.params.dept, request.params.course).map(a => a['CLASS_SECTION'])
        }
        else {
            return db.prepare('SELECT DISTINCT CLASS_SECTION FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC').all(request.params.term, request.params.dept, request.params.course).map(a => a['CLASS_SECTION'])
        }
    }, log))

    fastify.get('/api/table/:term/:dept/:course/:section', timer(async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT * FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? AND CLASS_SECTION=? ORDER BY TERM_CODE ASC').all(request.params.term, request.params.dept, request.params.course, request.params.section)
    }, log))

    fastify.get('/api/table/:term/:dept/:course', timer(async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === "all") {
            return db.prepare('SELECT * FROM records WHERE SUBJECT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC').all(request.params.dept, request.params.course)
        }
        else {
            return db.prepare('SELECT * FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC').all(request.params.term, request.params.dept, request.params.course)
        }
    }, log))
}

module.exports = routes
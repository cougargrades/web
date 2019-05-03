
const config = require('./config.json')
const db = require('better-sqlite3')('records.db', {
    readonly: true,
    fileMustExist: true
});

async function routes (fastify, options) {

    // (ID int primary key, TERM text, SUBJECT text, CATALOG_NBR smallint, CLASS_SECTION smallint, COURSE_DESCR text, INSTR_LAST_NAME text, INSTR_FIRST_NAME text, A smallint, B smallint, C smallint, D smallint, F smallint, Q smallint, AVG_GPA real, PROF_COUNT smallint, PROF_AVG real, TERM_CODE smallint, GROUP_CODE text)

    fastify.get('/', async (request, reply) => {
        return reply.view('./templates/index.mustache', { baseurl: config.baseurl })
    })

    fastify.get('/search/:id', async (request, reply) => {
        return `Searching for ${request.params.id}`
    })

    fastify.get('/api/catalog/list/terms', async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT DISTINCT TERM_CODE FROM records ORDER BY TERM_CODE ASC').all().map(a => a['TERM_CODE'])
    })

    fastify.get('/api/catalog/list/depts', async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT DISTINCT SUBJECT FROM records ORDER BY SUBJECT ASC').all().map(a => a['SUBJECT'])
    })

    fastify.get('/api/catalog/list/courses/:term/:dept', async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            return db.prepare('SELECT DISTINCT CATALOG_NBR FROM records WHERE SUBJECT=? ORDER BY CATALOG_NBR ASC').all(request.params.dept).map(a => a['CATALOG_NBR'])
        }
        else {
            return db.prepare('SELECT DISTINCT CATALOG_NBR FROM records WHERE TERM_CODE=? AND SUBJECT=? ORDER BY CATALOG_NBR ASC').all(request.params.term, request.params.dept).map(a => a['CATALOG_NBR'])
        }
    })
    fastify.get('/api/catalog/list/sections/:term/:dept/:course', async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === 'all') {
            return db.prepare('SELECT DISTINCT CLASS_SECTION FROM records WHERE SUBJECT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC').all(request.params.dept, request.params.course).map(a => a['CLASS_SECTION'])
        }
        else {
            return db.prepare('SELECT DISTINCT CLASS_SECTION FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC').all(request.params.term, request.params.dept, request.params.course).map(a => a['CLASS_SECTION'])
        }
    })

    fastify.get('/api/fetch/:term/:dept/:course/:section', async (request, reply) => {
        reply.type('application/json')
        return db.prepare('SELECT * FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? AND CLASS_SECTION=? ORDER BY TERM_CODE ASC').all(request.params.term, request.params.dept, request.params.course, request.params.section)
    })

    fastify.get('/api/table/:term/:dept/:course', async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === "all") {
            return db.prepare('SELECT * FROM records WHERE SUBJECT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC').all(request.params.dept, request.params.course)
        }
        else {
            return db.prepare('SELECT * FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC').all(request.params.term, request.params.dept, request.params.course)
        }
    })
}

module.exports = routes
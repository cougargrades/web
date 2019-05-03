
const config = require('./config.json')
const db = require('better-sqlite3')('records.db', {
    readonly: true,
    fileMustExist: true
});
//const row = db.prepare('SELECT * FROM users WHERE id=?').get(userId);

async function routes (fastify, options) {
  
    fastify.get('/', async (request, reply) => {
        return reply.view('./templates/index.mustache', { baseurl: config.baseurl })
    })

    fastify.get('/search/:id', async (request, reply) => {
        return `Searching for ${request.params.id}`
    })

    fastify.get('/api/table/:term/:dept/:course', async (request, reply) => {
        reply.type('application/json')
        if(request.params.term.toLowerCase() === "all") {
            return db.prepare('SELECT * FROM records WHERE SUBJECT=? AND CATALOG_NBR=?').all(request.params.dept, request.params.course)
        }
        else {
            return db.prepare('SELECT * FROM records WHERE TERM_CODE=? AND SUBJECT=? AND CATALOG_NBR=?').all(request.params.term, request.params.dept, request.params.course)
        }
    })
}

module.exports = routes
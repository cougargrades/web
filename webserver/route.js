
const config = require('./config.json')
const db = require('better-sqlite3')('records.db', {});
//const row = db.prepare('SELECT * FROM users WHERE id=?').get(userId);

async function routes (fastify, options) {
  
    fastify.get('/', async (request, reply) => {
        return reply.view('./templates/index.mustache', { baseurl: config.baseurl })
    })

    fastify.get('/search/:id', async (request, reply) => {
        return `Searching for ${request.params.id}`
    })
}

module.exports = routes
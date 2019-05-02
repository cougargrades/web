//const db = require('better-sqlite3')('foobar.db', {});
//const row = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
const fastify = require('fastify')({
	logger: true
})

fastify.get('/', async (request, reply) => {
	reply.type('application/json').code(200)
	return { hello: 'world' }
})

fastify.register(require('./route'), { prefix: '/v1' })

fastify.listen(3000, '0.0.0.0', (err, address) => {
	if (err) throw err
	fastify.log.info(`server listening on ${address}`)
})

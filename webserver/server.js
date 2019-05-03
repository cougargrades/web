'use strict'

require('make-promises-safe')
const path = require('path')
const config = require('./config.json')
const fastify = require('fastify')({
	logger: true
})

fastify.register(require('fastify-response-time'))
fastify.register(require('fastify-graceful-shutdown'))

fastify.register(require('fastify-rate-limit'), {
	max: 100,
	timeWindow: '1 minute'
})

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'public'),
	prefix: `${config.baseurl}/public/`, // optional: default '/'
})

// Use moustache for inserting prefixes into HTML
fastify.register(require('point-of-view'), {
	engine: {
		mustache: require('mustache')
	},
	options: {}
})

// Router file for prefixed endpoints
fastify.register(require('./route'), { prefix: config.baseurl })

fastify.listen(3000, '0.0.0.0', (err, address) => {
	if (err) throw err
	fastify.log.info(`server listening on ${address}`)
})

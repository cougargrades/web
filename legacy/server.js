'use strict'

const path = require('path')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '.env')})
require('make-promises-safe')
const fastify = require('fastify')({
	logger: false,
	trustProxy: true
})

fastify.register(require('fastify-response-time'))
fastify.register(require('fastify-graceful-shutdown'))
fastify.register(require('fastify-rate-limit'), {
	max: 100,
	timeWindow: '1 minute'
})

if(process.env.BASEURL === undefined) {
	console.warn('.env file might not be loaded')
}

const BASEURL = process.env.BASEURL || '/'

// Router file for prefixed endpoints
fastify.register(require('./route'), { prefix: BASEURL })

fastify.listen(3000, '0.0.0.0', (err, address) => {
	if (err) throw err
	if(process.env.NODE_ENV == 'production') {
		console.log('NODE_ENV set to production')
	}
	console.log(`server listening on ${address}${BASEURL}`)
})

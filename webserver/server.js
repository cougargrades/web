'use strict'

require('make-promises-safe')
const path = require('path')
const config = require('./config.json')
const fastify = require('fastify')({
	logger: false,
	trustProxy: true
})

const PORT = process.env.PORT
const STATIC_CACHE_AGE = 604800
const API_CACHE_AGE = 604800

fastify.register(require('fastify-response-time'))
fastify.register(require('fastify-graceful-shutdown'))

fastify.register(require('fastify-rate-limit'), {
	max: 100,
	timeWindow: '1 minute'
})

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'assets', 'public'),
	prefix: `${config.baseurl}/public/`, // optional: default '/'
	setHeaders: (res, path, stat) => {
		if(process.env.NODE_ENV === 'production') {
			// Cache static assets for 7 days
			res.setHeader('Cache-Control', `public, max-age=${STATIC_CACHE_AGE}`)
		}
	}
})

// Use moustache for inserting prefixes into HTML
fastify.register(require('point-of-view'), {
	engine: {
		mustache: require('mustache')
	},
	options: {}
})

// Router file for prefixed endpoints
fastify.register(require('./lib/route'), { prefix: config.baseurl })
fastify.use(`${config.baseurl}/api`, (req, res) => {
	res.setHeader('Cache-Control', `public, max-age=${API_CACHE_AGE}`)
})

fastify.listen(PORT, '0.0.0.0', (err, address) => {
	if (err) throw err
	if(process.env.NODE_ENV == 'production') {
		console.log('NODE_ENV set to production')
	}
	console.log(`server listening on ${address}`)
})

console.log(process.env)
console.log(config)
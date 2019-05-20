'use strict'

require('make-promises-safe')
const path = require('path')
const fastify = require('fastify')({
	logger: false,
	trustProxy: true
})

const BASEURL = process.env.WEBSERVER_BASEURL
const STATIC_CACHE_AGE = 604800 // 1 week in seconds
const API_CACHE_AGE = 604800

fastify.register(require('fastify-response-time'))
fastify.register(require('fastify-graceful-shutdown'))
fastify.register(require('fastify-rate-limit'), {
	max: 100,
	timeWindow: '1 minute'
})

const {promisify} = require('util')
const client = require('redis').createClient({
	host: 'redis' // docker defines hostname in /etc/hosts
});
const redis = {
	get: promisify(client.get).bind(client),
	set: promisify(client.set).bind(client),
	end: promisify(client.end).bind(client)
}

fastify.register(require('fastify-static'), {
	root: path.join(__dirname, 'assets', 'public'),
	prefix: `${BASEURL}/public/`, // optional: default '/'
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
fastify.register(require('./lib/route'), { prefix: BASEURL })
// fastify.use(`${BASEURL}/api/`, (req, res) => {
// 	res.setHeader('Cache-Control', `public, max-age=${API_CACHE_AGE}`)
// })

fastify.listen(3000, '0.0.0.0', (err, address) => {
	if (err) throw err
	if(process.env.NODE_ENV == 'production') {
		console.log('NODE_ENV set to production')
	}
	console.log(`server listening on ${address}`)
});

//console.log(process.env)
//console.log(config);

(async function(){
	// redis successful (expire in a day)
	await redis.set('message', 'hello world', 'EX', 60*60*24)
	console.log(await redis.get('message'))
	console.log(await redis.get('fake key'))

	// get the client
	const mysql = require('mysql2/promise');
	// create the connection
	const connection = await mysql.createConnection({
		host: 'cougar-grades.mariadb',
		user: 'root',
		password: process.env.MYSQL_ROOT_PASSWORD,
		database: 'records'
	});
	// query database
	const [rows, fields] = await connection.execute('SELECT * FROM records');
	console.log(rows)
})
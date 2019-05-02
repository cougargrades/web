async function routes (fastify, options) {
  
    fastify.get('/', async (request, reply) => {
        return { hello: 'world' }
    })

    fastify.get('/search/:id', async (request, reply) => {
        return `Searching for ${request.params.id}`
    })
}

module.exports = routes
import { env } from '@/env'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'

const server = fastify()

server.register(fastifyCors, { origin: '*' })

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server listening on port ${env.PORT}`)
})

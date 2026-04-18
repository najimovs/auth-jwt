import Fastify from "fastify"

const fastify = Fastify()

fastify.get( "/", () => ( { message: "ok" } ) )

fastify.listen( { port: 3_000 } )

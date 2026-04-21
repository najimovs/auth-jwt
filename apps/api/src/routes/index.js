import AuthRoutes from "./auth/index.js"

export default function( fastify ) {

	fastify.register( AuthRoutes )
}

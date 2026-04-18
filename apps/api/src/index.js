import Fastify from "fastify"

const fastify = Fastify()

const users = new Map()

fastify.get( "/", () => ( { message: "ok" } ) )

fastify.post( "/join", ( req, res ) => {

	const { username, email, password } = req.body

	if ( users.has( username ) ) {

		return res.status( 400 ).send( {
			code: "APP_AUTH_USERNAME_EXISTS",
		} )
	}

	users.set( username, { email, password } )

	return { username, email }
} )

fastify.listen( { port: 3_000 } )

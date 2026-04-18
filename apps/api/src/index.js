import Fastify from "fastify"
import Argon2 from "argon2"

const fastify = Fastify()

const users = new Map()

fastify.get( "/", () => ( { message: "ok" } ) )

fastify.post( "/join", async ( req, res ) => {

	let { username, email, password } = req.body

	password = await Argon2.hash( password )

	if ( users.has( username ) ) {

		return res.status( 400 ).send( {
			code: "APP_AUTH_USERNAME_EXISTS",
		} )
	}

	users.set( username, {
		email,
		password,
	} )

	console.log( users )

	return { username, email }
} )

fastify.listen( { port: 3_000 } )

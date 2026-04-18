import Fastify from "fastify"
import cors from "@fastify/cors"
import Argon2 from "argon2"
import JWT from "jsonwebtoken"

const fastify = Fastify()

fastify.register( cors )

const users = new Map()

users.set( "madina", {
	is_admin: true,
	email: "madina@gmail.com",
} )

const JWT_SECRET = "chubakabra"

fastify.get( "/", () => ( { message: "ok" } ) )

fastify.get( "/users", async ( req, res ) => {

	if ( !req.headers.authorization ) {

		return res.status( 401 ).send( {
			code: "APP_UNAUTHORIZED",
		} )
	}

	const token = req.headers.authorization.substr( 6 ).trim()

	try {

		const payload = await JWT.verify( token, JWT_SECRET )

		console.log( payload )
	}
	catch( error ) {

		res.status( 401 ).send( {
			code: "APP_UNAUTHORIZED",
			message: error.message,
		} )
	}

	return [ ...users.keys() ]
} )

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

	const payload = {
		username,
		is_admin: false,
	}

	const token = await JWT.sign( payload, JWT_SECRET )

	return {
		username,
		token
	}
} )

fastify.listen( { port: 3_000 } )

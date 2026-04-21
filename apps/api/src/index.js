import Fastify from "fastify"
import cors from "@fastify/cors"
import Argon2 from "argon2"
import JWT from "jsonwebtoken"

const PORT = parseInt( process.env.PORT || "3000" )
const fastify = Fastify()

fastify.register( cors )

const users = new Map()

users.set( "najimov", {
	is_admin: true,
	email: "najimov@gmail.com",
	password: "$argon2id$v=19$m=65536,t=3,p=4$J4lL7hmDmGkBRyx9uYpMZA$ty8F/aHsEJNmuCIGP5b/LdoH1D8pl7yOqFTiwLVsXBo",
} )

const JWT_SECRET = process.env.VITE_JWT_SECRET

fastify.get( "/", () => ( { message: "ok" } ) )

const ONE_MINUTE = 60

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

	const token = await JWT.sign( payload, JWT_SECRET, {
		expiresIn: ONE_MINUTE,
	} )

	return {
		username,
		token
	}
} )

fastify.post( "/login", async ( req, res ) => {

	let { username, password } = req.body

	if ( !users.has( username ) ) {

		return res.status( 400 ).send( {
			code: "APP_AUTH_USERNAME_NOT_EXISTS",
		} )
	}

	const user = users.get( username )

	try {

		const isValidPassword = await Argon2.verify( user.password, password )

		if ( !isValidPassword ) {

			return res.status( 400 ).send( {
				code: "APP_AUTH_PASSWORD_INVALID",
			} )
		}
	}
	catch( error ) {

		console.log( error )
	}

	const payload = {
		username,
		email: user.email,
		is_admin: user.is_admin,
	}

	const token = await JWT.sign( payload, JWT_SECRET, {
		expiresIn: ONE_MINUTE,
	} )

	return {
		username,
		token,
		is_admin: user.is_admin,
	}
} )

fastify.listen( { port: PORT } )

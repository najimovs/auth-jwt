import Argon2 from "argon2"
import JWT from "jsonwebtoken"
import { users } from "../../db.js"

const ONE_MINUTE = 60
const JWT_ACCESS_SECRET = process.env.VITE_JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.VITE_JWT_REFRESH_SECRET

export async function route( req, res ) {

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

	const accessToken = await JWT.sign( payload, JWT_ACCESS_SECRET, {
		expiresIn: ONE_MINUTE,
	} )

	const refreshToken = await JWT.sign( payload, JWT_REFRESH_SECRET, {
		expiresIn: ONE_MINUTE * 5,
	} )

	return {
		username,
		accessToken,
		refreshToken,
		is_admin: user.is_admin,
	}
}

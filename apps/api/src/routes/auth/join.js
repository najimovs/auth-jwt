import Argon2 from "argon2"
import JWT from "jsonwebtoken"
import { users } from "../../db.js"

const ONE_MINUTE = 60
const JWT_ACCESS_SECRET = process.env.VITE_JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.VITE_JWT_REFRESH_SECRET

export async function route( req, res ) {

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
	}
}

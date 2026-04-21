import JWT from "jsonwebtoken"
import { users } from "../../db.js"

const JWT_ACCESS_SECRET = process.env.VITE_JWT_ACCESS_SECRET

export async function route( req, res ) {

	if ( !req.headers.authorization ) {

		return res.status( 401 ).send( {
			code: "APP_UNAUTHORIZED",
		} )
	}

	const token = req.headers.authorization.substr( 6 ).trim()

	try {

		const payload = await JWT.verify( token, JWT_ACCESS_SECRET )

		console.log( payload )
	}
	catch( error ) {

		res.status( 401 ).send( {
			code: "APP_UNAUTHORIZED",
			message: error.message,
		} )
	}

	return [ ...users.keys() ]
}

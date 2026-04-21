import { route as join, schema as joinSchema } from "./join.js"
import { route as login } from "./login.js"
import { route as users } from "./users.js"

export default function( fastify ) {

	fastify.post( "/join", joinSchema, join )
	fastify.post( "/login", login )
	fastify.get( "/users", users )
}

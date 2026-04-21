import Fastify from "fastify"
import cors from "@fastify/cors"
import routes from "./routes/index.js"

const PORT = parseInt( process.env.PORT || "3000" )
const fastify = Fastify()

fastify.register( cors )
fastify.register( routes )

fastify.get( "/", () => ( { message: "ok" } ) )

fastify.listen( { port: PORT } )

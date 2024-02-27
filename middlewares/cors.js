import cors from 'cors'

const ACCEPTED_ORIGINS = [
	'http://localhost:1234',
	'http://localhost:8080',
	'http://localhost:3000',
	'https://movies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
	cors({
		origin: (origin, callback) => {
			if (acceptedOrigins.includes(origin)) return callback(null, true)

			if (!origin) return callback(null, true)

			return callback(new Error('Not allowed by CORS'))
		}
	})

/**
 * Implementación:
 * import corsMiddleware from './middlewares/cors.js'
 *
 * app.use(corsMiddleware({options}))
 * ref: options es un objeto que puede recibir el middleware que contiene la lista de Origenes permitidos
 */

import cors from 'cors'

// Definir los Origenes permitidos
const ACCEPTED_ORIGINS = [
	'http://localhost:1234',
	'http://localhost:8080',
	'http://localhost:3000',
	'https://movies.com'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
	cors({
		// Configuraciones del CORS
		origin: (origin, callback) => {
			// Verificar si el Origen de la Petición es válido
			if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true)

			// Habilitar CORS para cualquier Origen que realice una Peticion HTTP
			if (!origin) return callback(null, true)

			// Si no se Verifica el Origen de la Petición se devuelve un ERROR
			return callback(new Error('Not allowed by CORS'))
		}
	})
}

/**
 * Implementación:
 * import corsMiddleware from './middlewares/cors.js'
 *
 * app.use(corsMiddleware({options}))
 * ref: options es un objeto que puede recibir el middleware que contiene la lista de Origenes permitidos
 */

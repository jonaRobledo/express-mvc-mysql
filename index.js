import express, { json } from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'
import { createMovieRouter } from './routes/movies.js'
import { MovieModel } from './models/mysql/movies.js'

export const createApp = ({ movieModel }) => {
	const app = express()

	app.disable('x-powered-by')
	app.use(morgan('tiny'))
	app.use(json())
	app.use(corsMiddleware())

	app.get('/', (req, res) => {
		res.json({ message: 'Hello World!' })
	})

	app.use('/movies', createMovieRouter({ movieModel }))

	const PORT = process.env.PORT ?? 3000
	app.listen(PORT, () => {
		console.log(`Server listening on port http://localhost:${PORT}`)
	})
}

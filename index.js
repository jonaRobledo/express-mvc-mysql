// Imports Dependencies
import express, { json } from 'express'
import morgan from 'morgan'

// Imports Routers Modules
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()

app.disable('x-powered-by') // Desabilita el header X-Powered-By: Express

app.use(morgan('tiny'))
app.use(json())
app.use(corsMiddleware())

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' })
})

// GET Movies Routes
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
	console.log(`Server listening on port http://localhost:${PORT}`)
})

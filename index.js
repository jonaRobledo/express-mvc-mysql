import express, { json } from 'express'
import morgan from 'morgan'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()

app.disable('x-powered-by')

app.use(morgan('tiny'))
app.use(json())
//app.use(corsMiddleware())
// Error en corsMiddleware que frena ejecucion del servidor
// Resolver problema de rutas

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' })
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
	console.log(`Server listening on port http://localhost:${PORT}`)
})

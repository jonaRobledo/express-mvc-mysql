// Imports Dependencies
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const z = require('zod')

// Imports Core Modules
const crypto = require('crypto')

// Imports Project Modules
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by') // Desabilita el header X-Powered-By: Express

app.use(morgan('tiny'))
app.use(express.json())
// app.use(cors()) => Habilita las Peticiones HTTP a cualquier Origen (*)
app.use(
	cors({
		// Configuraciones del CORS
		origin: (origin, callback) => {
			// Definir los Origenes permitidos
			const ACCEPTED_ORIGINS = [
				'http://localhost:1234',
				'http://localhost:8080',
				'http://localhost:3000',
				'https://movies.com'
			]
			// Verificar si el Origen de la Petición es válido
			if (ACCEPTED_ORIGINS.includes(origin)) return callback(null, true)

			// Habilitar CORS para cualquier Origen que realice una Peticion HTTP
			if (!origin) return callback(null, true)

			// Si no se Verifica el Origen de la Petición se devuelve un ERROR
			return callback(new Error('Not allowed by CORS'))
		}
	})
)

app.get('/', (req, res) => {
	res.json({ message: 'Hello World!' })
})

// GET Movies Routes
app.get('/movies', (req, res) => {
	const { genre } = req.query
	if (genre) {
		const filteredMovies = movies.filter((movie) =>
			movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
		)
		return filteredMovies
			? res.json(filteredMovies)
			: res.json({ message: 'No movies of this genre were found' })
	}
	res.json(movies)
})

app.get('/movies/:id', (req, res) => {
	const { id } = req.params
	const movie = movies.find((movie) => movie.id === id)
	movie
		? res.json(movie)
		: res.status(404).json({ message: 'Movie not Found' })
})

// POST Movies Routes
app.post('/movies', (req, res) => {
	const result = validateMovie(req.body)

	if (result.error)
		return res.status(400).json({ error: JSON.parse(result.error.message) })

	const newMovie = {
		id: crypto.randomUUID(), // Generate a random UUID v4
		...result.data
	}

	// No es REST porque se rompe el principio de Stateless
	movies.push(newMovie)

	res.status(201).json(movies)
})

// DELETE Movies Routes
app.delete('/movies/:id', (req, res) => {
	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1) {
		console.log(movies[movieIndex])
		return res.status(404).json({ message: 'Movie not Found' })
	}

	movies.splice(movieIndex, 1)

	return res.json({ message: 'Movie Deleted.' })
})

// PATCH Movies Routes
app.patch('/movies/:id', (req, res) => {
	// 1ero Validamos que la Película exista en la Base de Datos
	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)
	if (movieIndex === -1)
		return res.status(404).json({ message: 'Movie not Found' })

	// 2do Validamos los datos enviados por el Cliente
	const result = validatePartialMovie(req.body)
	if (!result.success)
		return res.status(400).json({ error: JSON.parse(result.error.message) })

	// 3ero si las Validaciones se cumplen actualizamos la Película
	const updateMovie = {
		...movies[movieIndex],
		...result.data
	}
	movies[movieIndex] = updateMovie
	res.json(updateMovie)
})

app.listen(PORT, () => {
	console.log(`Server listening on port http://localhost:${PORT}`)
})

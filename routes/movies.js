// Import Dependencies
import { Router } from 'express'

// Imports Core Modules
import { randomUUID } from 'node:crypto'

// Imports Project Modules
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

// Initialize the Router
export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
	const { genre } = req.query
	const movies = await MovieModel.getAll({ genre })
	res.json(movies)
})

moviesRouter.get('/:id', (req, res) => {
	const { id } = req.params
	const movie = movies.find((movie) => movie.id === id)
	movie
		? res.json(movie)
		: res.status(404).json({ message: 'Movie not Found' })
})

moviesRouter.post('/', (req, res) => {
	const result = validateMovie(req.body)

	if (result.error)
		return res.status(400).json({ error: JSON.parse(result.error.message) })

	const newMovie = {
		id: randomUUID(), // Generate a random UUID v4
		...result.data
	}

	// No es REST porque se rompe el principio de Stateless
	movies.push(newMovie)

	res.status(201).json(movies)
})

moviesRouter.delete('/:id', (req, res) => {
	const { id } = req.params
	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1) {
		console.log(movies[movieIndex])
		return res.status(404).json({ message: 'Movie not Found' })
	}

	movies.splice(movieIndex, 1)

	return res.json({ message: 'Movie Deleted.' })
})

moviesRouter.patch('/:id', (req, res) => {
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

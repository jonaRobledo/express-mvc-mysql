// Utilidad para Obtener los datos de un JSON
import { readJSON } from '../utils.js'

// Import data from movies.json
const movies = readJSON('../movies.json')

export class MovieModel {
	static getAll = async ({ genre }) => {
		if (genre) {
			return movies.filter((movie) =>
				movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
			)
		}
		return movies
	}

	static getById = async ({}) => {}
}

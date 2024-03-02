import mysql from 'mysql2/promise'

// DB config
const config = {
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 3306,
	database: 'moviesdb'
}

// Database Connection
const connection = await mysql.createConnection(config)

export class MovieModel {
	static async getAll({ genre }) {
		// Get all Movies of the given genre from DB
		if (genre) {
			const lowerCaseGenre = genre.toLowerCase()
			const [genres] = await connection.query(
				'SELECT genre_id, name FROM genres WHERE LOWER(name) = ?;',
				[lowerCaseGenre]
			)

			// No genre found
			if (genres.length === 0) return null

			const [{ genre_id }] = genres
			const [movies] = await connection.query(
				'SELECT bin_to_uuid(m.movie_id) movie_id, m.title, m.year, m.director, m.duration, m.poster, m.rate FROM movies m JOIN movie_genres mg ON m.movie_id = mg.movie_id WHERE mg.genre_id = ?;',
				[genre_id]
			)
			return movies
		}

		// Get all Movies from DB
		const [movies] = await connection.query(
			'SELECT BIN_TO_UUID(movie_id) movie_id, title, year, director, duration, poster, rate FROM movies;'
		)
		return movies
	}

	static async getById({ id }) {
		const [movies] = await connection.query(
			`SELECT BIN_TO_UUID(movie_id) movie_id, title, year, director, duration, poster, rate
            FROM movies WHERE movie_id = UUID_TO_BIN(?);`,
			[id]
		)
		if (movies.length === 0) return null

		return movies[0]
	}

	static async create({ input }) {
		const {
			genre: genreInput, // * genre is an array
			title,
			year,
			duration,
			director,
			rate,
			poster
		} = input

		// todo: Create relation between movie and genres

		// Generate UUID with mysql
		const [{ uuid }] = await connection.query('SELECT UUID() uuid;')

		try {
			await connection.query(
				`INSERT INTO movies (movie_id, title, year, director, duration, poster, rate)
                VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`,
				[uuid, title, year, director, duration, poster, rate]
			)
		} catch (error) {
			throw new Error('Error creating movie')
		}
		const [movies] = await connection.query(
			`SELECT BIN_TO_UUID(movie_id) id, title, year, director, duration, poster, rate FROM movie WHERE movie_id = UUID_TO_BIN(?)`,
			[uuid]
		)
		// todo: review the create method
		return movies[0]
	}

	static async delete({ id }) {
		//
	}

	static async update({ id, input }) {
		//
	}
}

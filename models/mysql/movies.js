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
			'SELECT BIN_TO_UUID(movie_id) movie_id, title, year, director, duration, poster, rate FROM movies WHERE movie_id = UUID_TO_BIN(?);',
			[id]
		)
		if (movies.length === 0) return null

		return movies[0]
	}

	static async create({ input }) {
		const {
			genres, // * genre is an array
			title,
			year,
			duration,
			director,
			rate,
			poster
		} = input

		// Generate UUID with mysql
		const [[{ uuid }]] = await connection.query('SELECT UUID() uuid;')

		try {
			console.log(uuid)
			// Query for create Movie
			await connection.query(
				'INSERT INTO movies (movie_id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
				[uuid, title, year, director, duration, poster, rate]
			)
			genres.forEach(async (genre) => {
				// Query get genre_id from Genres table
				const [[{ genre_id }]] = await connection.query(
					'SELECT genre_id FROM genres WHERE name = ?',
					[genre]
				)
				// Query for relation a Movie with Genres
				await connection.query(
					'INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);',
					[uuid, genre_id]
				)
			})
		} catch (error) {
			console.log(err)
			throw new Error('Error creating movie')
		}
		// Search Movie created by UUID to return
		const [movies] = await connection.query(
			'SELECT BIN_TO_UUID(movie_id) id, title, year, director, duration, poster, rate FROM movies WHERE movie_id = UUID_TO_BIN(?)',
			[uuid]
		)
		// Search Genres relatione with Movie ID
		const [getMovieGenres] = await connection.query(
			'SELECT g.name FROM genres g JOIN movie_genres mg ON g.genre_id = mg.genre_id WHERE mg.movie_id = UUID_TO_BIN(?)',
			[uuid]
		)
		const movieGenres = []
		getMovieGenres.forEach((genre) => movieGenres.push(genre.name))
		return { ...movies[0], genres: movieGenres }
	}

	static async delete({ id }) {
		try {
			const [{ affectedRows }] = await connection.query(
				'DELETE FROM movies WHERE movie_id = UUID_TO_BIN(?)',
				[id]
			)

			if (affectedRows === 1) {
				await connection.query(
					'DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?)',
					[id]
				)
			} else {
				return false
			}
		} catch (err) {
			console.log(err)
			throw new Error('Error deleting movie')
		}
		return true
	}

	static async update({ id, input }) {
		const { genres, title, year, duration, director, rate, poster } = input
		try {
			const [{ affectedRows }] = await connection.query(
				`UPDATE movies SET title = IFNULL(?, title), year = IFNULL(?, year),
				duration = IFNULL(?, duration), poster = IFNULL(?, poster),
				director = IFNULL(?, director), rate = IFNULL(?, rate)
				WHERE movie_id = UUID_TO_BIN(?)`,
				[title, year, duration, poster, director, rate, id]
			)
			if (affectedRows === 0) {
				return false
			}
		} catch (err) {
			console.log(err)
			throw new Error('Error updating movie')
		}
		// Search Movie updated by UUID to return
		const [movies] = await connection.query(
			'SELECT BIN_TO_UUID(movie_id) id, title, year, director, duration, poster, rate FROM movies WHERE movie_id = UUID_TO_BIN(?)',
			[id]
		)
		// Search Genres relatione with Movie ID
		const [getMovieGenres] = await connection.query(
			'SELECT g.name FROM genres g JOIN movie_genres mg ON g.genre_id = mg.genre_id WHERE mg.movie_id = UUID_TO_BIN(?)',
			[id]
		)
		const movieGenres = []
		getMovieGenres.forEach((genre) => movieGenres.push(genre.name))
		return { ...movies[0], genres: movieGenres }
	}
}

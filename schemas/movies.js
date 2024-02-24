const z = require('zod')

const movieSchema = z.object({
	title: z.string({
		invalid_type_error: 'Movie title must be a string',
		required_error: 'Movie title is required'
	}),
	year: z
		.number({
			invalid_type_error: 'Movie year must be a number',
			required_error: 'Movie year is required'
		})
		.int()
		.min(1900)
		.max(2024),
	director: z.string({
		invalid_type_error: 'Movie director must be a string',
		required_error: 'Movie director is required'
	}),
	duration: z.number().int().positive(),
	rate: z.number().min(0).min(10).default(0),
	poster: z
		.string()
		.url({
			message: 'Movie poster must be a valid URL'
		})
		.endsWith('.jpg'),
	genre: z.array(
		z.enum([
			'Action',
			'Adventure',
			'Animation',
			'Biography',
			'Comedy',
			'Crime',
			'Drama',
			'Fantasy',
			'Horror',
			'Romance',
			'Thriller',
			'Sci-Fi'
		])
	)
})

function validateMovie(object) {
	return movieSchema.safeParse(object)
}

function validatePartialMovie(object) {
	return movieSchema.partial().safeParse(object)
}

module.exports = {
	validateMovie,
	validatePartialMovie
}

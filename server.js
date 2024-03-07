import { createApp } from './index.js'
import { MovieModel } from './models/mysql/movies.js'

createApp({ movieModel: MovieModel })

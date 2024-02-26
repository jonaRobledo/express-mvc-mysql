// Leer un archivo JSON en ESModules - No soportada aun
// import movies from './movies.json' with { type: 'json' }

// Leer un archivo JSON en ESModules - No recomendada
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8')

// Leer un archivo JSON en ESModules - Recomendada
import { createRequire } from 'node:module' // Importamos el creador de 'Require'
const require = createRequire(import.meta.url) // Instanciamos un 'Require'
export const readJSON = (path) => require(path)

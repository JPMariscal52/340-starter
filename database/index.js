/*const { Pool } = require("pg")
require("dotenv").config()
/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */
/*let pool
if (process.env.NODE_ENV == "development") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
})

// Added for troubleshooting queries
// during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      console.log("executed query", { text })
      return res
    } catch (error) {
      console.error("error in query", { text })
      throw error
    }
  },
}
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
  module.exports = pool
}*/
const { Pool } = require("pg")
require("dotenv").config()

// Determina si estás en entorno de desarrollo
const isDev = process.env.NODE_ENV === "development"

// Crea el pool de conexión
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isDev
    ? { rejectUnauthorized: false } // necesario para Render en dev
    : undefined, // producción sin configuración SSL explícita
})

// Exporta la función query para usar en tus modelos
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params)
      if (isDev) {
        console.log("executed query", { text })
      }
      return res
    } catch (error) {
      console.error("error in query", { text, error })
      throw error
    }
  }
}
// Exporta el pool para uso directo si es necesario
module.exports.pool = pool
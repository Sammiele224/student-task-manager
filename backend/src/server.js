import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { assertDbConnection, pool } from './db.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

// --- Health check -----------------------------------------------------------
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'unreachable', message: error.message })
  }
})

// --- Feature routes ---------------------------------------------------------
// Teammates: add routers here as you build them, e.g.
//   import coursesRouter from './routes/courses.js'
//   app.use('/api/courses', coursesRouter)
//   app.use('/api/tasks', tasksRouter)

// --- 404 --------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl })
})

// --- Error handler ----------------------------------------------------------
// Four arguments are required for Express to treat this as an error handler.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

async function start() {
  try {
    await assertDbConnection()
    console.log('Database connected.')
  } catch (error) {
    console.error('Could not connect to MySQL:', error.message)
    console.error('Check backend/.env and make sure MySQL is running.')
    process.exit(1)
  }

  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

start()
